import { addToFavouriteService, blogActionService, createBlogService, deleteBlogService, getBlogOnStateService, getBlogService, getFavouriteBlogsService, setBlogStateService, updateBlogService } from '../services/blog.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import { Types } from 'mongoose';
import responseHandler from '../utils/responseHandler.js';
import constants from '../config/constants.js';
import AppError from '../utils/appError.js';

// create blog
const createBlog = asyncHandler(async (req, res, next) => {
    const userId = new Types.ObjectId(req.user.id);
    const role = req.user.role;

    // console.log('create blog constroller -->', userId, role)

    const { title, content } = req.body;

    if (!title || !content)
        return next(
            new AppError(constants.BAD_REQUEST, 'All fields are required !!')
        );

    // handle image names
    let images = [];
    for (let file of req.files) {
        images.push({ url: file.filename, alt: title });
    }

    // create slug
    const slug =
        title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-') +
        '-' +
        Date.now();

    const newBlogTitle = await createBlogService({
        title,
        content,
        slug,
        images,
        userId,
        role,
    });

    responseHandler(
        res,
        constants.CREATED,
        'success',
        `New Blog created for ${newBlogTitle}`,
        { newBlogTitle }
    );
});

// get blogs
const getBlogs = asyncHandler(async (req, res, next) => {

    const query = req.query;
    if (!query)
        return next(
            new AppError(constants.BAD_REQUEST, 'All fields are required !!')
        );

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
    } = query;

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

        isActive: true,
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

    const isUnique = id || slug

    // console.log('feth blogs --> ', { page, size, blogOwnerName, filter, isUnique })

    const blogs = await getBlogService({ page, size, blogOwnerName, filter, isUnique })

    responseHandler(res, constants.OK, 'success', 'Blogs found', { blogs });
});

// update blog
const updateBlog = asyncHandler(async (req, res, next) => {

    const blogId = new Types.ObjectId(req.params.id)

    const { title, content } = req.body

    if (!title && !content)
        return next(
            new AppError(constants.BAD_REQUEST, 'All fields are required !!')
        );

    // handle images
    let images = []
    if (req.files) {

        for (let file of req.files) {

            for (let file of req.files) {
                images.push({ url: file.filename, alt: title });
            }
        }
    }

    let slug = '';
    if (title) slug = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') + '-' + Date.now();

    const updatedBlogTitle = await updateBlogService(blogId, {

        ...(title && { title }),
        ...(content && { content }),
        ...(req.files && { images }),
        'slug': slug
    })

    responseHandler(res, constants.OK, 'success', 'Blog updated successfully', { title: updatedBlogTitle })
})

// like or dislike blog
const likeOrDislike = asyncHandler(async (req, res, next) => {

    const { action } = req.body
    const userId = req.user.id
    const blogId = req.params.id

    // console.log('like blog -->  ', blogId, action)

    if (!['liked', 'disliked'].includes(action) || !blogId) next(new AppError(constants.BAD_REQUEST, 'invalid action'))

    await blogActionService({ userId, blogId }, action)

    responseHandler(res, constants.OK, 'success', action)

})

// make blog favourite
const addToFavourite = asyncHandler(async (req, res, next) => {

    const blogId = req.params.id
    const userId = req.user.id

    if (!blogId) return next(
        new AppError(constants.BAD_REQUEST, 'All fields are required !!')
    );

    await addToFavouriteService(userId, blogId)

    responseHandler(res, constants.OK, 'success', 'Added to Favourites')
})

// get favourtite blog
const favouriteBlog = asyncHandler(async (req, res, next) => {

    const userId = req.user.id
    const query = req.query;
    if (!query)
        return next(
            new AppError(constants.BAD_REQUEST, 'All fields are required !!')
        );

    const blogs = await getFavouriteBlogsService(query, userId)

    responseHandler(res, constants.OK, 'success', 'Favourite Blogs', blogs)
})

// delete blog
const deleteBlog = asyncHandler(async (req, res, next) => {

    const role = req.user.role
    const userId = req.user.id

    const query = req.query

    if (Object.keys(query).length === 0) return next(
        new AppError(constants.BAD_REQUEST, 'All fields are required !!')
    );

    const filter = {

        ...(role === 'Admin' ? { admin: userId } : { author: userId }),
        ...(query.slug && { slug: query.slug }),
        ...(query.id && { _id: query.id })
    }

    // console.log('delete blog --> ', filter, query)

    const title = await deleteBlogService(filter)

    responseHandler(res, constants.OK, 'success', 'Blog deleted successfully', title)


})

// set blog active or inActive
const setBlogState = asyncHandler(async (req, res, next) => {

    const userId = req.user.id
    const role = req.user.role
    const blogId = req.params.id
    const state = req.body.state

    if (!blogId) return next(
        new AppError(constants.BAD_REQUEST, 'All fields are required !!')
    );

    let filter;
    if (role === 'Admin') {
        filter = {

            _id: blogId,
        }
    } else {
        filter = {
            _id: blogId,
            author: userId
        }
    }
    await setBlogStateService(filter, state)

    responseHandler(res, constants.OK, 'success', `Blog state is set to ${state}`)

})

// get active or inactive blog
const getBlogOnState = asyncHandler(async (req, res, next) => {

    const role = req.user.role
    const userId = req.user.id

    const query = req.query;
    if (!query)
        return next(
            new AppError(constants.BAD_REQUEST, 'All fields are required !!')
        );

    const {
        title, slug, blogOwnerName, id, toYear, toMonth, toDay, fromYear, fromMonth, fromDay,
        page, size } = query;

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

        ...(role === 'Author' ? { author: new Types.ObjectId(userId) } : {}),
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

    const isUnique = id || slug

    // console.log('feth blogs --> ', { page, size, blogOwnerName, filter, isUnique })

    const blogs = await getBlogOnStateService({ page, size, blogOwnerName, filter, isUnique })

    responseHandler(res, constants.OK, 'success', 'Blogs found', { blogs });

})

export {
    createBlog,
    getBlogs,
    updateBlog,
    likeOrDislike,
    addToFavourite,
    favouriteBlog,
    deleteBlog,
    setBlogState,
    getBlogOnState
};
