import constants from '../config/constants.js';
import adminModel from '../models/admin.model.js';
// import userModel from '../models/user.model.js';
import AppError from '../utils/appError.js';
import sendEmail from '../utils/sendEmail.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'


// register author service
const registerAdminService = async (data) => {
    const { adminEmail, adminPassword, adminName, adminAvatar } = data;

    const existingUser = await adminModel.findOne({ adminEmail });

    if (existingUser)
        throw new AppError(
            constants.CONFLICT,
            'User is already registered with this email'
        );

    // send otp by email
    const EMAIL_USER = process.env.EMAIL_USER;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await sendEmail(
        EMAIL_USER,
        adminEmail,
        'Email Verification',
        `Your OTP for blog management is ${otp}`
    );

    // save user
    const newReader = new adminModel({ adminEmail, adminPassword, adminName, adminAvatar, readerOtp: otp, role: 'Admin' });

    await newReader.save();

    return { email: newReader.adminEmail };
};

// login author service
const loginAdminService = async (data) => {
    const { adminEmail, adminPassword } = data;

    const existingUser = await adminModel.findOne({ adminEmail });

    if (!existingUser)
        throw new AppError(constants.NOT_FOUND, 'User is not present');

    const valid = await bcrypt.compare(adminPassword, existingUser.adminPassword);
    if (!valid)
        throw new AppError(constants.UNAUTHORIZED, 'Invalid Creentials');

    const SECRET_KEY = process.env.SECRET_KEY;
    const token = jwt.sign(
        { id: existingUser._id, role: existingUser.role },
        SECRET_KEY,
        {
            expiresIn: '10d',
        }
    );

    return token;
};

// create author service
const createAuthorService = async (data) => {
    const { email } = data;

    const existingUser = await userModel.findOneAndUpdate(
        { email },
        { role: 'author' }
    );

    if (!existingUser)
        throw new AppError(constants.SERVER_ERROR, 'Something went wrong');

    // send an email to user to notify that he is now an author
    const EMAIL_USER = process.env.EMAIL_USER;
    await sendEmail(
        EMAIL_USER,
        email,
        'Request permission to become author',
        `You are now author`
    );
};

export {

    registerAdminService,
    loginAdminService,
    createAuthorService
}
