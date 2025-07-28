import { Router } from 'express';
import profileImageUpload from '../middleware/uploadUserAvatar.js';
import { loginAuthor, registerAuthor } from '../controllers/author.controller.js';

const route = Router();

// login and registration
route
    .post('/register', profileImageUpload.single('avatar'), registerAuthor)
    .post('/login', loginAuthor);
    // .post('/verify-email', verifyEmail)

// request route
// route.post('/request-author-role', verifyToken, requestAuthorRole);


export default route;
