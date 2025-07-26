import constants from '../config/constants.js';
// import userModel from '../models/user.model.js';
import AppError from '../utils/appError.js';
import sendEmail from '../utils/sendEmail.js';

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

export { createAuthorService };
