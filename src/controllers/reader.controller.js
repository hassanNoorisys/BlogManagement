import { loginReaderService, registerReaderService } from "../services/reader.service.js";
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import constants from '../config/constants.js';
import responseHandler from '../utils/responseHandler.js';

// register reader
const registerReader = asyncHandler(async (req, res, next) => {

    const { readerEmail, readerPassword, readerName } = req.body;

    // console.log('reader --> ', req.body)

    if (!readerEmail || !readerPassword || !readerName)
        return next(
            new AppError(constants.BAD_REQUEST, 'All fields are required !!')
        );

    // handle image url
    const readerAvatar = req.file.filename;

    const data = await registerReaderService({ readerEmail, readerPassword, readerName, readerAvatar });

    responseHandler(
        res,
        constants.OK,
        'success',
        'OTP is sent to your email',
        data
    );
});

// login reader
const loginReader = asyncHandler(async (req, res, next) => {

    const { readerEmail, readerPassword } = req.body;

    console.log('login --> ', readerEmail, readerPassword);
    if (!readerEmail || !readerPassword)
        return next(
            new AppError(constants.BAD_REQUEST, 'All fields are required !!')
        );

    const token = await loginReaderService({ readerEmail, readerPassword });

    responseHandler(res, constants.OK, 'success', 'Login Successfull', {
        readerEmail,
        token,
    });
})

export { registerReader, loginReader }