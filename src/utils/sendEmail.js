import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const sendEmail = async (from, to, subject, otp, name) => {
  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_PASS = process.env.EMAIL_PASS;
  const EMAIL_SERVICE = process.env.EMAIL_SERVICE;

  const transporter = nodemailer.createTransport({
    service: EMAIL_SERVICE,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  let otpHTMLTemplate = await fs.readFile(
    path.join(__dirname, '../public/html/otp-email-template.html'),
    'utf8'
  );

  otpHTMLTemplate = otpHTMLTemplate
    .replace('{{username}}', name)
    .replace('{{otp}}', otp);

  await transporter.sendMail({
    from: from,
    to: to,
    subject: subject,
    html: otpHTMLTemplate,
  });
};

export default sendEmail;
