import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import constants from '../config/constants.js';
import { createAuthorService, loginAdminService, registerAdminService } from '../services/admin.service.js';
import responseHandler from '../utils/responseHandler.js';


// register admin
const registerAdmin = asyncHandler(async (req, res, next) => {

    const { adminEmail, adminPassword, adminName } = req.body;

    // console.log('reader --> ', req.body)

    if (!adminEmail || !adminPassword || !adminName)
        return next(
            new AppError(constants.BAD_REQUEST, 'All fields are required !!')
        );

    // handle image url
    const adminAvatar = req.file.filename;

    const data = await registerAdminService({ adminEmail, adminPassword, adminName, adminAvatar });

    responseHandler(
        res,
        constants.OK,
        'success',
        'OTP is sent to your email',
        data
    );
});

// login admin
const loginAdmin = asyncHandler(async (req, res, next) => {

    const { adminEmail, adminPassword } = req.body;

    console.log('login --> ', adminEmail, adminPassword);
    if (!adminEmail || !adminPassword)
        return next(
            new AppError(constants.BAD_REQUEST, 'All fields are required !!')
        );

    const token = await loginAdminService({ adminEmail, adminPassword });

    responseHandler(res, constants.OK, 'success', 'Login Successfull', {
        adminEmail,
        token,
    });
})


// create author
const createAuthor = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    if (!email)
        return next(
            new AppError(constants.BAD_REQUEST, 'All Fields are required')
        );

    await createAuthorService({ email });

    responseHandler(res, constants.OK, 'success', 'The user is now an author');
});

export { registerAdmin, loginAdmin, createAuthor }