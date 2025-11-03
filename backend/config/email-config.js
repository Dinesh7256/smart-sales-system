// backend/config/email-config.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Gmail SMTP configuration (more reliable and higher limits)
const sender = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD
    }
});

export default sender;