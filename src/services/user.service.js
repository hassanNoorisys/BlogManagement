import constants from '../config/constants.js';
import AppError from '../utils/appError.js';
import adminModel from '../models/admin.model.js'
import readerModel from '../models/reader.model.js'
import authorModel from '../models/author.model.js'

// register fcm token service
const registerFCMTokenService = async ({ role, userId }, fcmToken) => {

    let user;
    if (role === 'Admin') {

        user = await adminModel.findByIdAndUpdate({ _id: userId }, { fcmToken: fcmToken })

    } else if (role === 'Autor') {

        user = await authorModel.findByIdAndUpdate({ _id: userId }, { fcmToken: fcmToken })
    } else {

        user = await readerModel.findByIdAndUpdate({ _id: userId }, { fcmToken: fcmToken })
    }

    if (!user) throw new AppError(constants.NOT_FOUND, 'User is not present');
}

// verify email service
const verifyEmailService = async (data) => {
    const { email, otp } = data;

    const existingUser = await userModel.findOne({ email });

    if (!existingUser)
        throw new AppError(
            constants.NOT_FOUND,
            'User not found with this email'
        );

    if (otp !== existingUser.otp)
        throw new AppError(constants.BAD_REQUEST, 'Invalid OTP');
};

// request author service
const requestAuthorService = async (data) => {
    const { email } = data;

    const existingUser = await userModel.findOne({ email });

    if (!existingUser)
        throw new AppError(constants.NOT_FOUND, 'User is not present');

    if (existingUser.role === 'author')
        throw new AppError(constants.NO_CONTENT, 'You are already an author');

    // send an email to admin to make the user an author
    const EMAIL_USER = process.env.EMAIL_USER;

    await sendEmail(
        EMAIL_USER,
        EMAIL_USER,
        'Request permission to become an athor',
        `The user having email: ${email} has requested to be an author`
    );
};

export {
    verifyEmailService,
    requestAuthorService,
    registerFCMTokenService
};
