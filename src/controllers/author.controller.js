import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import constants from '../config/constants.js';
import responseHandler from '../utils/responseHandler.js';
import { loginAuthorService, registerAuthorService } from "../services/author.service.js";

// register reader
const registerAuthor = asyncHandler(async (req, res, next) => {

    const { authorEmail, authorPassword, authorName } = req.body;

    // console.log('reader --> ', req.body)

    if (!authorEmail || !authorPassword || !authorName)
        return next(
            new AppError(constants.BAD_REQUEST, 'All fields are required !!')
        );

    // handle image url
    const authorAvatar = req.file.filename;

    const data = await registerAuthorService({ authorEmail, authorPassword, authorName, authorAvatar });

    responseHandler(
        res,
        constants.OK,
        'success',
        'OTP is sent to your email',
        data
    );
});

// login reader
const loginAuthor = asyncHandler(async (req, res, next) => {

    const { authorEmail, authorPassword } = req.body;

    console.log('login --> ', authorEmail, authorPassword);
    if (!authorEmail || !authorPassword)
        return next(
            new AppError(constants.BAD_REQUEST, 'All fields are required !!')
        );

    const token = await loginAuthorService({ authorEmail, authorPassword });

    responseHandler(res, constants.OK, 'success', 'Login Successfull', {
        authorEmail,
        token,
    });
})


export { registerAuthor, loginAuthor }