import AppError from '../utils/appError.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';
import constants from '../config/constants.js';
import authorModel from '../models/author.model.js';


// register author service
const registerAuthorService = async (data) => {
    const { authorEmail, authorPassword, authorName, authorAvatar } = data;

    const existingUser = await authorModel.findOne({ authorEmail });

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
        authorEmail,
        'Email Verification',
        `Your OTP for blog management is ${otp}`
    );

    // save user
    const newReader = new authorModel({ authorEmail, authorPassword, authorName, authorAvatar, readerOtp: otp, role: 'Author', bio: 'A description about author' });

    await newReader.save();

    return { email: newReader.authorEmail };
};

// login author service
const loginAuthorService = async (data) => {
    const { authorEmail, authorPassword } = data;

    const existingUser = await authorModel.findOne({ authorEmail });

    if (!existingUser)
        throw new AppError(constants.NOT_FOUND, 'User is not present');

    const valid = await bcrypt.compare(authorPassword, existingUser.authorPassword);
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


export {

    registerAuthorService,
    loginAuthorService
}