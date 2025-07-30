import { Router } from 'express';
import verifyRole from '../middleware/verifyRole.js';
import verifyToken from '../middleware/verifyToken.js';
import blogImageUpload from '../middleware/uploadBlogImage.js';
import {
    addToFavourite,
    createBlog,
    deleteBlog,
    favouriteBlog,
    getBlogOnState,
    getBlogs,
    likeOrDislike,
    setBlogState,
    updateBlog,
} from '../controllers/blog.controller.js';
import rateLimit from '../middleware/rateLimit.js';

const route = Router();

route.post(
    '/create',
    verifyToken,
    verifyRole('Admin', 'Author'),
    blogImageUpload.array('images'),
    createBlog
);

route
    .get('/', rateLimit, getBlogs)
    .get('/favourite', rateLimit, verifyToken, favouriteBlog)
    .get(
        '/state',
        rateLimit,
        verifyToken,
        verifyRole('Admin', 'Author'),
        getBlogOnState
    );

route
    .patch(
        '/:id',
        blogImageUpload.array('images'),
        verifyToken,
        verifyRole('Admin', 'Author'),
        updateBlog
    )
    .patch(
        '/state/:id',
        rateLimit,
        verifyToken,
        verifyRole('Admin', 'Author'),
        setBlogState
    ); // change blog state to active or inactive

route
    .post('/action/:id', rateLimit, verifyToken, likeOrDislike) // like or dislike blog
    .post('/add-to-favourite/:id', rateLimit, verifyToken, addToFavourite); // make blog favourite

route.delete('/', verifyToken, verifyRole('Admin', 'Author'), deleteBlog);

export default route;
