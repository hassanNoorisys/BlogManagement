import { createBlogService, getBlogService, updateBlogService } from '../services/blog.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import { Types } from 'mongoose';
import responseHandler from '../utils/responseHandler.js';
import constants from '../config/constants.js';

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

    const blogs = await getBlogService(query);

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
    if (req.files) {

    }

    let slug = '';
    if (title) slug = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') + '-' + Date.now();


    console.log('update blog --> ', typeof slug)

    const updatedBlogTitle = await updateBlogService(blogId, {

        ...(title && { title }),
        ...(content && { content }),
        'slug': slug
    })

    console.log(Date.now())

    responseHandler(res, constants.OK, 'success', 'Blog updated successfully', { title: updatedBlogTitle })
})
export {
    createBlog,
    getBlogs,
    updateBlog
};
