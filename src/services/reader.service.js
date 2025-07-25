import AppError from '../utils/appError.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';
import readerModel from '../models/reader.model.js';
import constants from '../config/constants.js';

// register reader service
const registerReaderService = async (data) => {
    const { readerEmail, readerPassword, readerName, readerAvatar } = data;

    const existingUser = await readerModel.findOne({ readerEmail });

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
        readerEmail,
        'Email Verification',
        `Your OTP for blog management is ${otp}`
    );

    // save user
    const newReader = new readerModel({ readerEmail, readerPassword, readerName, readerAvatar, readerOtp: otp, role: 'Reader' });

    await newReader.save();

    return { email: newReader.readerEmail };
};

// login user service
const loginReaderService = async (data) => {
    const { readerEmail, readerPassword } = data;

    const existingUser = await readerModel.findOne({ readerEmail });

    if (!existingUser)
        throw new AppError(constants.NOT_FOUND, 'User is not present');

    const valid = await bcrypt.compare(readerPassword, existingUser.readerPassword);
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

    registerReaderService,
    loginReaderService
}