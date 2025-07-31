import { Types } from 'mongoose';
import constants from '../config/constants.js';
import blogModel from '../models/blog.model.js';
import AppError from '../utils/appError.js';
import adminModel from '../models/admin.model.js';
import authorModel from '../models/author.model.js';
import readerModel from '../models/reader.model.js';
import fcmAdmin from '../config/firebase/config.js'

const getBlogPipeline = [
    {
        $lookup: {
            from: 'admins',
            localField: 'admin',
            foreignField: '_id',
            as: 'admin',
        },
    },
    {
        $lookup: {
            from: 'authors',
            localField: 'author',
            foreignField: '_id',
            as: 'author',
        },
    },
    {
        $addFields: {
            user: {
                $cond: {
                    if: { $gt: [{ $size: '$author' }, 0] },
                    then: {
                        $mergeObjects: [
                            { $arrayElemAt: ['$author', 0] },
                            {
                                email: {
                                    $arrayElemAt: ['$author.authorEmail', 0],
                                },
                                name: {
                                    $arrayElemAt: ['$author.authorName', 0],
                                },
                                avatar: {
                                    $arrayElemAt: ['$author.authorAvatar', 0],
                                },
                                bio: { $arrayElemAt: ['$author.bio', 0] },
                            },
                        ],
                    },
                    else: {
                        $mergeObjects: [
                            { $arrayElemAt: ['$admin', 0] },
                            {
                                email: {
                                    $arrayElemAt: ['$admin.adminEmail', 0],
                                },
                                name: { $arrayElemAt: ['$admin.adminName', 0] },
                                avatar: {
                                    $arrayElemAt: ['$admin.adminAvatar', 0],
                                },
                                bio: null,
                            },
                        ],
                    },
                },
            },
        },
    },
];

// create blog service
const createBlogService = async (data) => {
    const { title, content, images, userId, role, slug } = data;

    const [admin, author, readers] = await Promise.all([
        adminModel.findOne({ _id: userId }),
        authorModel.findOne({ _id: userId }),
        readerModel.find()
    ]);

    // console.log('create blog service --> ', author)
    if (admin || (author && author.isDeleted == true))
        throw new AppError(constants.UNAUTHORIZED, 'User not registered');

    const user = role === 'admin' ? { admin: userId } : { author: userId };

    const newBlog = new blogModel({ title, content, images, slug, ...user });
    await newBlog.save();

    const registrationTokens = []
    for (const reader of readers) {
        if (reader.fcmToken) registrationTokens.push(reader.fcmToken)
    }

    if (registrationTokens.length < 1) return

    const message = {
        tokens: registrationTokens,
        notification: {
            title: 'Blog Update',
            body: `New blog is created by ${role === 'Admin' ? admin.adminName : author.authorName} `
        },
    }

    await fcmAdmin.messaging().sendMulticast(message)

    return title;
};

// get blog service
const getBlogService = async ({
    page,
    size,
    blogOwnerName,
    filter,
    isUnique,
}) => {
    const blogs = await blogModel.aggregate([
        {
            $match: filter,
        },

        ...getBlogPipeline,

        ...(blogOwnerName
            ? [
                {
                    $match: {
                        'user.name': {
                            $regex: blogOwnerName,
                            $options: 'i',
                        },
                    },
                },
            ]
            : []),
        {
            $project: {
                title: 1,
                slug: 1,
                content: 1,
                createdAt: 1,
                isActive: 1,
                'user.email': 1,
                'user.name': 1,
                'user.avatar': 1,
                'user.bio': 1,
                'user.role': 1,
                'user._id': 1,
            },
        },
        { $skip: !isUnique ? (page - 1) * size || 0 : 0 },
        { $limit: Number(!isUnique ? size || 5 : 1) },
    ]);

    if (!blogs || blogs.length < 1)
        throw new AppError(constants.NOT_FOUND, 'Blog not found');

    // console.log('get blog services -->', blogs)
    return blogs;
};

// update blog
const updateBlogService = async (filter, data) => {
    // TODO: find the blog then delete the image if image is updated
    // const oldBlog = await blogModel.findById(filter)

    // if (data.images) {

    //     for (let image of data.images) {

    //         console.log()
    //         await fs.unlink(image.url)
    //     }
    // }

    const updatedBlog = await blogModel
        .findByIdAndUpdate({ _id: filter }, data, { new: true })
        .select(['title']);

    console.log('update blog service --> ', updatedBlog);

    return updatedBlog.title;
};

// like or dislike blog
const blogActionService = async (filter, action) => {
    const { userId, blogId } = filter;

    const [reader, blog] = await Promise.all([
        readerModel.findById({ _id: userId }),
        blogModel.findById({ _id: blogId }),
    ]);

    if (!blog || !reader)
        throw new AppError(
            constants.BAD_REQUEST,
            'User or blog does not exist'
        );

    const alreadyLiked = blog.likedBy.includes(userId);
    const alreadyDisliked = blog.disLikedBy.includes(userId);

    // console.log('like blog service --> ', alreadyLiked, alreadyDisliked)

    const updateOps = [];
    if (action === 'liked') {
        console.log('like blog service --> ', alreadyLiked, alreadyDisliked);

        if (alreadyLiked) return;

        if (alreadyDisliked) {
            updateOps.push(
                blogModel.updateOne(
                    { _id: blogId },
                    {
                        $pull: { disLikedBy: userId },
                        $inc: { dislikeCount: -1 },
                    }
                )
            );
            updateOps.push(
                readerModel.updateOne(
                    { _id: userId },
                    { $pull: { dislikedBlog: blogId } }
                )
            );
        }

        // Add to likes
        updateOps.push(
            blogModel.updateOne(
                { _id: blogId },
                {
                    $addToSet: { likedBy: userId },
                    $inc: { likeCount: 1 },
                }
            )
        );
        updateOps.push(
            readerModel.updateOne(
                { _id: userId },
                { $addToSet: { likedBlog: blogId } }
            )
        );
    } else if (action === 'disliked') {
        if (alreadyDisliked) return;

        if (alreadyLiked) {
            updateOps.push(
                blogModel.updateOne(
                    { _id: blogId },
                    {
                        $pull: { likedBy: userId },
                        $inc: { likeCount: -1 },
                    }
                )
            );
            updateOps.push(
                readerModel.updateOne(
                    { _id: userId },
                    { $pull: { likedBlog: blogId } }
                )
            );
        }

        // Add to dislikes
        updateOps.push(
            blogModel.updateOne(
                { _id: blogId },
                {
                    $addToSet: { disLikedBy: userId },
                    $inc: { dislikeCount: 1 },
                }
            )
        );
        updateOps.push(
            readerModel.updateOne(
                { _id: userId },
                { $addToSet: { dislikedBlog: blogId } }
            )
        );
    }

    await Promise.all(updateOps);
};

// make blog fabourite
const addToFavouriteService = async (userId, blogId) => {
    const [reader, blog] = await Promise.all([
        readerModel.findOne({ _id: userId }),
        blogModel.findOne({ _id: blogId }),
    ]);

    if (!blog || !reader)
        throw new AppError(
            constants.BAD_REQUEST,
            'User or blog does not exist'
        );

    const alreadyFavouite = blog.favouritedBy.includes(userId);

    if (alreadyFavouite) return;

    await Promise.all([
        readerModel.updateOne(
            { _id: userId },
            { $addToSet: { favouriteBlog: blogId } }
        ),
        blogModel.updateOne(
            { _id: blogId },
            { $addToSet: { favouritedBy: userId }, $inc: { favouriteCount: 1 } }
        ),
    ]);
};

// get all favourite blogs
const getFavouriteBlogsService = async (query, userId) => {
    const {
        title,
        slug,
        blogOwnerName,
        id,

        toYear,
        toMonth,
        toDay,

        fromYear,
        fromMonth,
        fromDay,

        page,
        size,
    } = query;

    const fy =
        typeof fromYear !== 'undefined'
            ? Number(fromYear)
            : new Date().getFullYear();
    const fm = typeof fromMonth !== 'undefined' ? Number(fromMonth) - 1 : 0;
    const fd = typeof fromDay !== 'undefined' ? Number(fromDay) : 1;

    const ty =
        typeof toYear !== 'undefined'
            ? Number(toYear)
            : new Date().getFullYear();

    const tm = typeof toMonth !== 'undefined' ? Number(toMonth) - 1 : 0;
    const td = typeof toDay !== 'undefined' ? Number(toDay) : 1;

    const from = new Date(fy, fm, fd);
    const to = new Date(ty, tm, td + 1);

    const filter = {
        favouritedBy: new Types.ObjectId(userId),
        ...(slug && { slug }),
        ...(id && { _id: new Types.ObjectId(id) }),
        ...(title && { title }),
        ...(fromYear || toYear || fromMonth || toMonth || fromDay || toDay
            ? {
                createdAt: {
                    $gte: from,
                    $lt: to,
                },
            }
            : {}),
    };

    const isUniqueQuery = id || slug;
    const blogs = await blogModel.aggregate([
        {
            $match: filter,
        },

        ...getBlogPipeline,

        ...(blogOwnerName
            ? [
                {
                    $match: {
                        'user.name': {
                            $regex: blogOwnerName,
                            $options: 'i',
                        },
                    },
                },
            ]
            : []),
        {
            $project: {
                title: 1,
                slug: 1,
                content: 1,
                createdAt: 1,
                'user.email': 1,
                'user.name': 1,
                'user.avatar': 1,
                'user.bio': 1,
                'user.role': 1,
            },
        },
        { $skip: !isUniqueQuery ? (page - 1) * size || 0 : 0 },
        { $limit: Number(!isUniqueQuery ? size || 5 : 1) },
    ]);

    console.log('favourte blog service --> ', filter);
    if (!blogs || blogs.length < 1)
        throw new AppError(constants.NO_CONTENT, 'Blog not found');

    return blogs;
};

// delete blog
const deleteBlogService = async (filter) => {
    const blog = await blogModel.findOneAndDelete(filter);

    if (!blog) throw new AppError(constants.NOT_FOUND, 'Blog not found');

    // console.log('delete blog service --> ', blog)

    // TODO: delete id of favorite, liked, disliked blog from reader model

    return blog.title;
};

// maek active or inActive
const setBlogStateService = async (filter, state) => {
    const blog = await blogModel.findOneAndUpdate(filter, {
        isActive: state === 'active' ? true : false,
    });
};

// get blog on different state
const getBlogOnStateService = async ({
    page,
    size,
    blogOwnerName,
    filter,
    isUnique,
}) => {
    const blogs = await blogModel.aggregate([
        {
            $match: filter,
        },

        ...getBlogPipeline,

        ...(blogOwnerName
            ? [
                {
                    $match: {
                        'user.name': {
                            $regex: blogOwnerName,
                            $options: 'i',
                        },
                    },
                },
            ]
            : []),
        {
            $project: {
                title: 1,
                slug: 1,
                content: 1,
                createdAt: 1,
                isActive: 1,
                'user.email': 1,
                'user.name': 1,
                'user.avatar': 1,
                'user.bio': 1,
                'user.role': 1,
                'user._id': 1,
            },
        },
        { $skip: !isUnique ? (page - 1) * size || 0 : 0 },
        { $limit: Number(!isUnique ? size || 5 : 1) },
    ]);

    if (!blogs || blogs.length < 1)
        throw new AppError(constants.NOT_FOUND, 'Blog not found');

    // console.log('get blog services -->', blogs)
    return blogs;
};

export {
    createBlogService,
    getBlogService,
    updateBlogService,
    blogActionService,
    addToFavouriteService,
    getFavouriteBlogsService,
    deleteBlogService,
    setBlogStateService,
    getBlogOnStateService,
};
