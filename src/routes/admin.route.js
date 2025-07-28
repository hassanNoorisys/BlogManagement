import { Router } from 'express';
import { createAuthor, getAdmin, loginAdmin, registerAdmin, updateAdmin, } from '../controllers/admin.controller.js';

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
route.post('/create-author', verifyToken, verifyRole('Admin'), createAuthor);

route.get('/', verifyToken, verifyRole('Admin'), getAdmin)
    .patch('/', profileImageUpload.single('avatar'), verifyToken, verifyRole('Admin'), updateAdmin)


export default route;
