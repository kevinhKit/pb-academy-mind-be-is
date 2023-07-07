import * as nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: 'eralejo2003@gmail.com',
    pass: 'pgiljdvsyeucqgvk',
  },
});

transporter.verify().then(() => {
  console.log('ready for send emails');
});
