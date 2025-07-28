import { Router } from 'express';
import verifyRole from '../middleware/verifyRole.js';
import verifyToken from '../middleware/verifyToken.js';
import blogImageUpload from '../middleware/uploadBlogImage.js';
import { addToFavourite, createBlog, favouriteBlog, getBlogs, likeOrDislike, updateBlog } from '../controllers/blog.controller.js';

const route = Router();

route.post(
    '/create',
    verifyToken,
    verifyRole('Admin', 'Author'),
    blogImageUpload.array('images'),
    createBlog
);

route.get('/', getBlogs)
    .get('/favourite', verifyToken, favouriteBlog)

route.patch('/:id', blogImageUpload.array('images'), verifyToken, verifyRole('Admin', 'Author'), updateBlog)

// like or dislike blog
route.post('/action/:id', verifyToken, likeOrDislike)

// make blog favourite
route.post('/add-to-favourite/:id', verifyToken, addToFavourite)

export default route;
