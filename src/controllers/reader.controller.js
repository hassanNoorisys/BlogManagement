import {
    deleteReaderService,
    loginReaderService,
    registerReaderService,
} from '../services/reader.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import constants from '../config/constants.js';
import responseHandler from '../utils/responseHandler.js';
import { Types } from 'mongoose';

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

    const data = await registerReaderService({
        readerEmail,
        readerPassword,
        readerName,
        readerAvatar,
    });

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
});

// delete reader
const deleteReader = asyncHandler(async (req, res, next) => {
    const query = req.query;

    if (!query)
        return next(
            new AppError(constants.BAD_REQUEST, 'All fields are required !!')
        );

    const filter = {
        ...(query.id && { _id: new Types.ObjectId(query.id) }),
        ...(query.email && { readerEmail: query.email }),
    };
    const { email, name } = await deleteReaderService(filter);

    responseHandler(res, constants.OK, 'success', 'User deleted successfully', {
        email,
        name,
    });
});

export { registerReader, loginReader, deleteReader };
