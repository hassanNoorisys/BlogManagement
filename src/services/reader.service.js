import AppError from '../utils/appError.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import readerModel from '../models/reader.model.js';
import constants from '../config/constants.js';
import { sendOTPEmail } from '../utils/sendEmail.js';
import authorModel from '../models/author.model.js';
import messaging from '../config/firebase/config.js'

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

    await sendOTPEmail(
        EMAIL_USER,
        readerEmail,
        'Your OTP for Email Verification',
        otp,
        readerName
    );

    // save user
    const newReader = new readerModel({
        readerEmail,
        readerPassword,
        readerName,
        readerAvatar,
        readerOtp: otp,
        role: 'Reader',
    });

    await newReader.save();

    return { email: newReader.readerEmail };
};

// login user service
const loginReaderService = async (data) => {
    const { readerEmail, readerPassword } = data;

    const existingUser = await readerModel.findOne({ readerEmail });

    if (!existingUser)
        throw new AppError(constants.NOT_FOUND, 'User is not present');

    const valid = await bcrypt.compare(
        readerPassword,
        existingUser.readerPassword
    );
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

// delete reader
const deleteReaderService = async (filter) => {
    const user = await readerModel.findOneAndDelete(filter);

    if (!user) throw new AppError(constants.NOT_FOUND, 'User is not present');

    // console.log('delete reader service --> ', user)

    // TODO: delete the likedBlog, favoritedBy in blog collection

    return { email: readerEmail, name: readerName };
};

// subscribe author service
const subscribeAuthorService = async (authorId, userId) => {

    const [author, reader] = await Promise.all([

        authorModel.findByIdAndUpdate({ _id: authorId }, { $addToSet: { subscribbers: userId }, }, { new: true }),
        readerModel.findByIdAndUpdate({ _id: userId }, { $addToSet: { subscribedTo: authorId }, }, { new: true })
    ])

    if (!author || !reader) throw new AppError(constants.NOT_FOUND, 'User or Author not found')

    await messaging.subscribeToTopic(reader.fcmToken, authorId.toString())
}

export { registerReaderService, loginReaderService, deleteReaderService, subscribeAuthorService };
