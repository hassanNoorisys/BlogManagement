import { Router } from 'express';
import { createAuthor, loginAdmin, registerAdmin, } from '../controllers/admin.controller.js';

import verifyRole from '../middleware/verifyRole.js';
import verifyToken from '../middleware/verifyToken.js';
import profileImageUpload from '../middleware/uploadUserAvatar.js';

const route = Router();


// login and registration
route
    .post('/register', profileImageUpload.single('avatar'), registerAdmin)
    .post('/login', loginAdmin);
    // .post('/verify-email', verifyEmail)


// admin realted routes
route.post('/create-author', verifyToken, verifyRole('admin'), createAuthor);

export default route;
