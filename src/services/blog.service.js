import { Types } from 'mongoose';
import constants from '../config/constants.js';
import blogModel from '../models/blog.model.js';
// import userModel from '../models/user.model.js';
import AppError from '../utils/appError.js';
import adminModel from '../models/admin.model.js'
import authorModel from '../models/author.model.js'
import fs from 'fs/promises'
import readerModel from '../models/reader.model.js';

// create blog service
const createBlogService = async (data) => {
    const { title, content, images, userId, role, slug } = data;

    const [admin, author] = await Promise.all([
        adminModel.findOne({ _id: userId }),
        authorModel.findOne({ _id: userId })
    ])

    if (!admin && !author && author.isDeleted == true)
        throw new AppError(constants.UNAUTHORIZED, 'User not registered');

    const user = role === 'admin' ? { admin: userId } : { author: userId };

    const newBlog = new blogModel({ title, content, images, slug, ...user });
    await newBlog.save();

    return title;
};

// get blog service
const getBlogService = async (data) => {
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
        size
    } = data;

    const fy =
        typeof fromYear !== 'undefined'
            ? Number(fromYear)
            : new Date().getFullYear();
    const fm = typeof fromMonth !== 'undefined' ? Number(fromMonth) - 1 : 0;
    const fd = typeof fromDay !== 'undefined' ? Number(fromDay) : 1;

    const ty = typeof toYear !== 'undefined'
        ? Number(toYear)
        : new Date().getFullYear();

    const tm = typeof toMonth !== 'undefined' ? Number(toMonth) - 1 : 0;
    const td = typeof toDay !== 'undefined' ? Number(toDay) : 1;

    const from = new Date(fy, fm, fd);
    const to = new Date(ty, tm, td + 1);


    const filter = {
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
    console.log('feth blogs services--> ', filter)

    const isUniqueQuery = id || slug
    const blogs = await blogModel.aggregate([
        {
            $match: filter,
        },
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
                                    email: { $arrayElemAt: ['$author.authorEmail', 0] },
                                    name: { $arrayElemAt: ['$author.authorName', 0] },
                                    avatar: { $arrayElemAt: ['$author.authorAvatar', 0] },
                                    bio: { $arrayElemAt: ['$author.bio', 0] },
                                }
                            ],
                        },
                        else: {
                            $mergeObjects: [
                                { $arrayElemAt: ['$admin', 0] },
                                {
                                    email: { $arrayElemAt: ['$admin.adminEmail', 0] },
                                    name: { $arrayElemAt: ['$admin.adminName', 0] },
                                    avatar: { $arrayElemAt: ['$admin.adminAvatar', 0] },
                                    bio: null,
                                }
                            ],
                        },
                    },
                },
            },
        },
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
        { $skip: !isUniqueQuery ? ((page - 1) * size || 0) : 0 },
        { $limit: Number(!isUniqueQuery ? size || 5 : 1) },
    ]);



    if (!blogs || blogs.length < 1)
        throw new AppError(constants.NO_CONTENT, 'Blog not found');

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

    const updatedBlog = await blogModel.findByIdAndUpdate({ _id: filter }, data, { new: true })
        .select(['title'])

    console.log('update blog service --> ', updatedBlog)

    return updatedBlog.title
}

// like or dislike blog
const blogActionService = async (filter) => {

    const { action, userId, blogId } = filter

    const [reader, blog] = await Promise.all([

        readerModel.findById({ _id: userId }),
        blogModel.findById({ _id: blogId })
    ])

    if (!blog || !reader) throw new AppError(constants.BAD_REQUEST, 'User or blog does not exist')

    const alreadyLiked = blog.likedBy.includes(userId);
    const alreadyDisliked = blog.disLikedBy.includes(userId);

    const updateOps = [];
    if (action === 'liked') {
        if (alreadyLiked)
            return

        if (alreadyDisliked) {
            updateOps.push(
                blogModel.updateOne(
                    { _id: blogId },
                    {
                        $pull: { disLikedBy: userId },
                        $inc: { dislikeCount: -1 }
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
                    $inc: { likeCount: 1 }
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
        if (alreadyDisliked)
            return

        if (alreadyLiked) {
            updateOps.push(
                blogModel.updateOne(
                    { _id: blogId },
                    {
                        $pull: { likedBy: userId },
                        $inc: { likeCount: -1 }
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
                    $inc: { dislikeCount: 1 }
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
}

export { createBlogService, getBlogService, updateBlogService, blogActionService };
