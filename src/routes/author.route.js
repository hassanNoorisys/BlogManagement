import { Router } from 'express';
import profileImageUpload from '../middleware/uploadUserAvatar.js';
import { loginAuthor, registerAuthor } from '../controllers/author.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import verifyRole from '../middleware/verifyRole.js';

const route = Router();

// login and registration
route
    .post('/register', verifyToken, verifyRole('Admin'), profileImageUpload.single('avatar'), registerAuthor)
    .post('/login', loginAuthor);
    // .post('/verify-email', verifyEmail)

// request route
// route.post('/request-author-role', verifyToken, requestAuthorRole);


export default route;
