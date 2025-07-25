import constants from '../config/constants.js';
import userModel from '../models/user.model.js';
import AppError from '../utils/appError.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';

// register user service
const registerUserService = async (data) => {
  const { email, password, bio } = data;

  const existingUser = await userModel.findOne({ email });

  if (existingUser)
    throw new AppError(
      constants.CONFLICT,
      'User is already registered with this email'
    );

  // send otp by email
  const EMAIL_USER = process.env.EMAIL_USER;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await sendEmail(EMAIL_USER, email, 'Email Verification', `Your OTP for blog management is ${otp}`)

  // save user
  const newUser = new userModel({ email, password, bio, otp });

  await newUser.save();

  return { email: newUser.email };
};

// verify email service
const verifyEmailService = async (data) => {
  const { email, otp } = data;

  const existingUser = await userModel.findOne({ email });

  if (!existingUser)
    throw new AppError(constants.NOT_FOUND, 'User not found with this email');

  if (otp !== existingUser.otp)
    throw new AppError(constants.BAD_REQUEST, 'Invalid OTP');
};

// login user service
const loginUsersService = async (data) => {
  const { email, password } = data;

  const existingUser = await userModel.findOne({ email });

  if (!existingUser)
    throw new AppError(constants.NOT_FOUND, 'User is not present');

  const valid = await bcrypt.compare(password, existingUser.password);
  if (!valid) throw new AppError(constants.UNAUTHORIZED, 'Invalid Creentials');

  const SECRET_KEY = process.env.SECRET_KEY;
  const token = jwt.sign({ id: existingUser._id, role: existingUser.role }, SECRET_KEY, {
    expiresIn: '10d',
  });

  return token;
};

// request author service
const requestAuthorService = async (data) => {

  const { email } = data;

  const existingUser = await userModel.findOne({ email })

  if (!existingUser)
    throw new AppError(constants.NOT_FOUND, 'User is not present');

  if (existingUser.role === 'author') throw new AppError(constants.NO_CONTENT, 'You are already an author')

  // send an email to admin to make the user an author
  const EMAIL_USER = process.env.EMAIL_USER;

  await sendEmail(EMAIL_USER, EMAIL_USER, 'Request permission to become an athor', `The user having email: ${email} has requested to be an author`)

}

export { registerUserService, verifyEmailService, loginUsersService, requestAuthorService };
