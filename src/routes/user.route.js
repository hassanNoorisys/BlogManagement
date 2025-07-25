import { Router } from "express";
import { loginUser, registerUser, verifyEmail } from "../controllers/user.controller.js";
import profileImageUpload from "../middleware/uploadUserAvatar.js";

const route = Router()

route.post('/register', profileImageUpload.single('bio[avatar]'), registerUser)
    .post('/verify-email', verifyEmail)

route.post('/login', loginUser)


export default route