import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const sendOTPEmail = async (from, to, subject, otp, name) => {


  let { transporter, HtmlTemplate } = await initEmail('otp_template')
  HtmlTemplate = HtmlTemplate
    .replace('{{username}}', name)
    .replace('{{otp}}', otp);

  await transporter.sendMail({
    from: from,
    to: to,
    subject: subject,
    html: HtmlTemplate,
  });
};

// send welcome email 
const sendWelcomeEmail = async (from, to, subject, name) => {

  let { transporter, HtmlTemplate } = await initEmail('welcome_author_template')

  // console.log('send welcome email --> ', transporter, HtmlTemplate)

  HtmlTemplate = HtmlTemplate.replace('{{authorName}}', name)

  await transporter.sendMail({
    from: from,
    to: to,
    subject: subject,
    html: HtmlTemplate,
  });
}

async function initEmail(file) {

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

  const HtmlTemplate = await fs.readFile(path.join(__dirname, '../public/html/', getFilePath(file)), 'utf8');

  // console.log('send welcome email --> ', transporter, HtmlTemplate)

  return { transporter, HtmlTemplate }
}


function getFilePath(file) {

  const filePath = {

    otp_template: 'otp-email-template.html',
    welcome_author_template: 'author-registration-template.html'
  }

  return filePath[file]
}
export { sendOTPEmail, sendWelcomeEmail };
