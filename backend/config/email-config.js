// backend/config/email-config.js
import nodemailer from 'nodemailer';
import sgmail from 'nodemailer-sendgrid-transport';
import dotenv from 'dotenv';

dotenv.config();

const options = {
    auth: {
        api_key: process.env.SENDGRID_API_KEY 
    }
}

const sender = nodemailer.createTransporter(sgmail(options));

export default sender;