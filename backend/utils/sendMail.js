import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendSubscribeMail = async (email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to Inspace 🎉",
    html: `
      <h2>Thanks for subscribing!</h2>
      <p>You’ll now receive updates from Inspace.</p>
    `,
    attachments: [
      {
        filename: "offer.pdf",
        path: "./files/offer.pdf", // file path in your backend
      },
    ],
  };
  console.log("Sending mail to:", email);
  await transporter.sendMail(mailOptions);
};

export default sendSubscribeMail;