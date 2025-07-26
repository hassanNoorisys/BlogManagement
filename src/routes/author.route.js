import { Router } from 'express';
import profileImageUpload from '../middleware/uploadUserAvatar.js';
import verifyToken from '../middleware/verifyToken.js';
import { loginAuthor, registerAuthor } from '../controllers/author.controller.js';

const route = Router();

// login and registration
route
    .post('/register', profileImageUpload.single('avatar'), registerAuthor)
    // .post('/verify-email', verifyEmail)
    .post('/login', loginAuthor);

// request route
// route.post('/request-author-role', verifyToken, requestAuthorRole);

export default route;
