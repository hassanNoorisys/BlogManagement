import { Router } from 'express';
import profileImageUpload from '../middleware/uploadUserAvatar.js';
import verifyToken from '../middleware/verifyToken.js';
import {
    deleteReader,
    loginReader,
    registerReader,
} from '../controllers/reader.controller.js';
import verifyRole from '../middleware/verifyRole.js';
import rateLimit from '../middleware/rateLimit.js';

const route = Router();

// login and registration
route
    .post(
        '/register',
        rateLimit,
        profileImageUpload.single('avatar'),
        registerReader
    )
    .post('/login', rateLimit, loginReader);
// .post('/verify-email', verifyEmail)

// request route
// route.post('/request-author-role', verifyToken, requestAuthorRole);

route.delete('/', verifyToken, verifyRole('Admin'), deleteReader);

export default route;
