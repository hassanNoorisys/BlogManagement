import nodemailer from 'nodemailer';

const sendEmail = async (from, to, subject, message) => {

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

    await transporter.sendMail({
        from: from,
        to: to,
        subject: subject,
        text: message
    });
}

export default sendEmail