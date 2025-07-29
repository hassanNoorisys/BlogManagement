import { Router } from 'express';
import verifyRole from '../middleware/verifyRole.js';
import verifyToken from '../middleware/verifyToken.js';
import blogImageUpload from '../middleware/uploadBlogImage.js';
import { addToFavourite, blogState, createBlog, deleteBlog, favouriteBlog, getBlogOnState, getBlogs, likeOrDislike, updateBlog } from '../controllers/blog.controller.js';

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
    .get('/state', verifyToken, verifyRole('Admin', 'Auhtor'), getBlogOnState)

route.patch('/:id', blogImageUpload.array('images'), verifyToken, verifyRole('Admin', 'Author'), updateBlog)


route.post('/action/:id', verifyToken, likeOrDislike)       // like or dislike blog
    .post('/add-to-favourite/:id', verifyToken, addToFavourite) // make blog favourite
    .post('/state/:id', verifyToken, verifyRole('Admin', 'Author'), blogState)


route.delete('/', verifyToken, verifyRole('Admin', 'Author'), deleteBlog)


route

export default route;
