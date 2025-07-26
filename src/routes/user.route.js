import { Router } from 'express';
import {
  loginUser,
  registerUser,
  requestAuthorRole,
  verifyEmail,
} from '../controllers/user.controller.js';
import profileImageUpload from '../middleware/uploadUserAvatar.js';
import verifyToken from '../middleware/verifyToken.js';

const route = Router();

// login and registration
route
  .post('/register', profileImageUpload.single('bio[avatar]'), registerUser)
  .post('/verify-email', verifyEmail)
  .post('/login', loginUser);

// request route
route.post('/request-author-role', verifyToken, requestAuthorRole);

export default route;
