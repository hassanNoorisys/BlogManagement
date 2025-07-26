import { Router } from 'express';
import profileImageUpload from '../middleware/uploadUserAvatar.js';
import verifyToken from '../middleware/verifyToken.js';
import { loginReader, registerReader } from '../controllers/reader.controller.js';

const route = Router();

// login and registration
route
    .post('/register', profileImageUpload.single('avatar'), registerReader)
    // .post('/verify-email', verifyEmail)
    .post('/login', loginReader);

// request route
// route.post('/request-author-role', verifyToken, requestAuthorRole);

export default route;
