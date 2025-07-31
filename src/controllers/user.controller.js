import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import constants from '../config/constants.js';
import {
    registerFCMTokenService,
    requestAuthorService,
    verifyEmailService,
} from '../services/user.service.js';
import responseHandler from '../utils/responseHandler.js';

// register fcm token 
const registerFCMToken = asyncHandler(async (req, res, next) => {

    const role = req.user.role
    const userId = req.user.id

    const fcmToken = req.body.fcmToken

    await registerFCMTokenService({ role, userId }, fcmToken)

    responseHandler(res, constants.OK, 'success', 'FCM token registered')

})

// verify email
const verifyEmail = asyncHandler(async (req, res, next) => {
    const { email, otp } = req.body;

    if (!email || !otp)
        return next(
            new AppError(constants.BAD_REQUEST, 'All fields are required !!')
        );

    await verifyEmailService({ email, otp });

    responseHandler(
        res,
        constants.CREATED,
        'success',
        'User Registered successfully'
    );
});

// request author role
const requestAuthorRole = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    if (!email)
        return next(
            new AppError(constants.BAD_REQUEST, 'All fields are required !!')
        );

    await requestAuthorService({ email });

    responseHandler(res, constants.OK, 'success', 'Request has been sent');
});

export { verifyEmail, requestAuthorRole, registerFCMToken };
