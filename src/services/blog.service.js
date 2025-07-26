import { Types } from 'mongoose';
import constants from '../config/constants.js';
import blogModel from '../models/blog.model.js';
import userModel from '../models/user.model.js';
import AppError from '../utils/appError.js';

// create blog service
const createBlogService = async (data) => {
    const { title, content, images, userId, role, slug } = data;

    const existingUser = await userModel
        .findOne({ _id: userId })
        .select(['_id']);
    if (!existingUser)
        throw new AppError(constants.SERVER_ERROR, 'Something went wrong');

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
    } = data;

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

    // console.log(from, to, fromYear, toYear)

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

    const blogs = await blogModel.aggregate([
        {
            $match: filter,
        },
        {
            $lookup: {
                from: 'users',
                localField: 'author',
                foreignField: '_id',
                as: 'author',
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'admin',
                foreignField: '_id',
                as: 'admin',
            },
        },
        {
            $addFields: {
                user: {
                    $cond: [
                        { $gt: [{ $size: '$author' }, 0] },
                        { $arrayElemAt: ['$author', 0] },
                        { $arrayElemAt: ['$admin', 0] },
                    ],
                },
            },
        },
        ...(blogOwnerName
            ? [
                  {
                      $match: {
                          'user.bio.name': {
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
                'user.bio': 1,
            },
        },
    ]);

    if (!blogs || blogs.length < 1)
        throw new AppError(constants.NO_CONTENT, 'Blog not found');

    // console.log('get blogs service -->  ', blogs)
    return blogs;
};

export { createBlogService, getBlogService };
