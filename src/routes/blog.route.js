import { Router } from 'express';
import verifyRole from '../middleware/verifyRole.js';
import verifyToken from '../middleware/verifyToken.js';
import blogImageUpload from '../middleware/uploadBlogImage.js';
import { createBlog } from '../controllers/blog.controller.js';

const route = Router();

route.post('/create',verifyToken ,verifyRole('admin', 'author'), blogImageUpload.array('images'), createBlog)

// route.get('/')



export default route;
