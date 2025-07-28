import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import constants from '../config/constants.js';
import { createAuthorService, getAdminSerivce, loginAdminService, registerAdminService } from '../services/admin.service.js';
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
    const { readerEmail } = req.body;

    if (!readerEmail)
        return next(
            new AppError(constants.BAD_REQUEST, 'All Fields are required')
        );

    await createAuthorService({ readerEmail });

    responseHandler(res, constants.OK, 'success', 'The user is now an author');
});

// get admin
const getAdmin = asyncHandler(async (req, res, next) => {

    const id = req.user.id

    console.log(req.user)

    if (!id)
        return next(
            new AppError(constants.BAD_REQUEST, 'You are not registered ')
        );

    const admin = await getAdminSerivce(id);

    responseHandler(res, constants.OK, 'success', 'Admin found', { admin });

})

export { registerAdmin, loginAdmin, createAuthor, getAdmin }