import constants from '../config/constants.js';
import userModel from '../models/user.model.js';
import AppError from '../utils/appError.js';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

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
  const EMAIL_PASS = process.env.EMAIL_PASS;
  const EMAIL_SERVICE = process.env.EMAIL_SERVICE;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const transporter = nodemailer.createTransport({
    service: EMAIL_SERVICE,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `Blog managment ${EMAIL_USER}`,
    to: email,
    subject: 'Email Verification',
    text: `Your OTP for blog management is ${otp}`,
  });

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
  const token = jwt.sign({ id: existingUser._id }, SECRET_KEY, {
    expiresIn: '10d',
  });

  return token;
};

export { registerUserService, verifyEmailService, loginUsersService };
