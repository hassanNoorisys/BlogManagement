import { Router } from 'express';
import {
    createAuthor,
} from '../controllers/admin.controller.js';

import verifyRole from '../middleware/verifyRole.js';
import verifyToken from '../middleware/verifyToken.js';

const route = Router();

// admin realted routes
route.post('/create-author', verifyToken, verifyRole('admin'), createAuthor)


export default route;