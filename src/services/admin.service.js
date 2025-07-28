import constants from '../config/constants.js';
import adminModel from '../models/admin.model.js';
// import userModel from '../models/user.model.js';
import AppError from '../utils/appError.js';
import sendEmail from '../utils/sendEmail.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import authorModel from '../models/author.model.js'
import readerModel from '../models/reader.model.js'

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
    const { readerEmail } = data;

    const [author, reader] = await Promise.all([

        authorModel.findOne({ authorEmail: readerEmail }),
        readerModel.findOne({ readerEmail })
    ])

    if (author && author.role === 'Author')
        throw new AppError(constants.CONFLICT, 'User is already an Author');

    if (!reader) throw new AppError('User is not registed')

    const newAuthor = new authorModel({
        authorEmail: readerEmail,
        authorPassword: reader.readerPassword,
        authorName: reader.readerName,
        authorAvatar: reader.readerAvatar,
        role: 'Author'
    })

    await newAuthor.save()

    await reader.deleteOne({ readerEmail })

    // console.log('create author service --> ', reader, author)

    // send an email to user to notify that he is now an author
    const EMAIL_USER = process.env.EMAIL_USER;
    await sendEmail(
        EMAIL_USER,
        readerEmail,
        'Request permission to become an author',
        `You are now author, you can use the blog management service,
        Update your bio in your profile to showcase yourself, 
        
        Thanks for using our platform`
    );
};

// get authors service
const getAdminSerivce = async (query) => {

    const admin = await adminModel.findOne({ _id: query })
        .select(['-adminPassword', '-createdAt', '-updatedAt', '-adminOtp']).lean()

    console.log('admin service --> ', admin)

    if (!admin) throw new AppError(constants.NO_CONTENT, 'No admin found')

    return admin
}

export {

    registerAdminService,
    loginAdminService,
    createAuthorService,
    getAdminSerivce
}
