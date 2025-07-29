import { Router } from 'express';
import profileImageUpload from '../middleware/uploadUserAvatar.js';
import verifyToken from '../middleware/verifyToken.js';
import { deleteReader, loginReader, registerReader } from '../controllers/reader.controller.js';
import verifyRole from '../middleware/verifyRole.js';

const route = Router();

// login and registration
route
    .post('/register', profileImageUpload.single('avatar'), registerReader)
    .post('/login', loginReader);
// .post('/verify-email', verifyEmail)

// request route
// route.post('/request-author-role', verifyToken, requestAuthorRole);

route.delete('/', verifyToken, verifyRole('Admin'), deleteReader)

export default route;
