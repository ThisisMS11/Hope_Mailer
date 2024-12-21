import nodemailer from "nodemailer";

const sendEmail = async (options: any) => {
  const transporter = nodemailer.createTransport({
    //@ts-ignore
    host: process.env.HOST,
    service: process.env.SERVICE,
    port: process.env.EMAIL_PORT,
    secure: process.env.SECURE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    debug: true,
  });

  const message = {
    from: process.env.EMAIL_USER,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };
  const info = await transporter.sendMail(message);
  return info;
};

export { sendEmail };
