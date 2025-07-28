import { Router } from 'express';
import { createAuthor, getAdmin, getAuthors, loginAdmin, registerAdmin, softDelteAuthor, updateAdmin, } from '../controllers/admin.controller.js';

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


// related to author management
route.get('/', verifyToken, verifyRole('Admin'), getAuthors)

route.delete('/', verifyToken, verifyRole('Admin'), softDelteAuthor)

export default route;
