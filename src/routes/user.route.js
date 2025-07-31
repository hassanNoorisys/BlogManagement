import { Router } from 'express';
import {
    requestAuthorRole,
} from '../controllers/user.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import { registerFCMToken } from '../controllers/user.controller.js';

const route = Router();

route.post('/register-fcm-token', verifyToken, registerFCMToken)

// request route
route.post('/request-author-role', verifyToken, requestAuthorRole);

export default route;
