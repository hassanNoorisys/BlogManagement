import { Router } from 'express';
import profileImageUpload from '../middleware/uploadUserAvatar.js';
import verifyToken from '../middleware/verifyToken.js';
import { getAuthors, loginAuthor, registerAuthor } from '../controllers/author.controller.js';
import verifyRole from '../middleware/verifyRole.js';

const route = Router();

// login and registration
route
    .post('/register', profileImageUpload.single('avatar'), registerAuthor)
    // .post('/verify-email', verifyEmail)
    .post('/login', loginAuthor);

// request route
// route.post('/request-author-role', verifyToken, requestAuthorRole);

// get authors
route.get('/', verifyToken, verifyRole('Admin'), getAuthors)

export default route;
