import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import constants from '../config/constants.js';
import {
  loginUsersService,
  registerUserService,
  requestAuthorService,
  verifyEmailService,
} from '../services/user.service.js';
import responseHandler from '../utils/responseHandler.js';

// registe user
const registerUser = asyncHandler(async (req, res, next) => {
  const { email, password, bio } = req.body;

  if (!email || !password || !bio.name || !bio.profile)
    return next(
      new AppError(constants.BAD_REQUEST, 'All fields are required !!')
    );

  // handle image url
  const avatar = req.file.filename;
  bio.avatar = avatar;

  const data = await registerUserService({ email, password, bio });

  responseHandler(
    res,
    constants.OK,
    'success',
    'OTP is sent to your email',
    data
  );
});

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

// login user
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  console.log('login --> ', email, password);
  if (!email || !password)
    return next(
      new AppError(constants.BAD_REQUEST, 'All fields are required !!')
    );

  const token = await loginUsersService({ email, password });

  responseHandler(res, constants.OK, 'success', 'Login Successfull', {
    email,
    token,
  });
});

// request author role
const requestAuthorRole = asyncHandler(async (req, res, next) => {

  const { email } = req.body

  if (!email)
    return next(
      new AppError(constants.BAD_REQUEST, 'All fields are required !!')
    );

  await requestAuthorService({ email })

  responseHandler(res, constants.OK, 'success', 'Request has been sent')

})


export { registerUser, verifyEmail, loginUser, requestAuthorRole };
