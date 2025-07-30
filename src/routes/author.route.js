import { Router } from 'express';
import profileImageUpload from '../middleware/uploadUserAvatar.js';
import {
    loginAuthor,
    registerAuthor,
} from '../controllers/author.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import verifyRole from '../middleware/verifyRole.js';
import rateLimit from '../middleware/rateLimit.js';

const route = Router();

// rate limit
route.use(rateLimit);

// login and registration
route
    .post(
        '/register',
        verifyToken,
        verifyRole('Admin'),
        profileImageUpload.single('avatar'),
        registerAuthor
    )
    .post('/login', loginAuthor);
// .post('/verify-email', verifyEmail)

// request route
// route.post('/request-author-role', verifyToken, requestAuthorRole);

export default route;
