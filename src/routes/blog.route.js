import { Router } from 'express';
import verifyRole from '../middleware/verifyRole.js';
import verifyToken from '../middleware/verifyToken.js';
import blogImageUpload from '../middleware/uploadBlogImage.js';
import { createBlog, getBlogs, updateBlog } from '../controllers/blog.controller.js';

const route = Router();

route.post(
    '/create',
    verifyToken,
    verifyRole('admin', 'author'),
    blogImageUpload.array('images'),
    createBlog
);

route.get('/', getBlogs);

route.patch('/:id', verifyToken, verifyRole('admin', 'author'), updateBlog)

export default route;
