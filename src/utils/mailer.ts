import { Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
require('dotenv').config();

const logger = new Logger('loggerTransporterTwo');

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: Boolean(process.env.SMTP_SECURE),
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

transporter.verify().then(() => {
  // logger.log('Ready for send emails')
});
