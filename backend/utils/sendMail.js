import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendSubscribeMail = async (email) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error(
      "Email is not configured (missing EMAIL_USER / EMAIL_PASS env vars)."
    );
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const offerPath = path.join(__dirname, "..", "files", "offer.pdf");
  const hasOfferAttachment = fs.existsSync(offerPath);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to Inspace 🎉",
    html: `
      <h2>Thanks for subscribing!</h2>
      <p>You’ll now receive updates from Inspace.</p>
    `,
    ...(hasOfferAttachment
      ? {
          attachments: [
            {
              filename: "offer.pdf",
              path: offerPath,
            },
          ],
        }
      : {}),
  };
  console.log("Sending mail to:", email);
  await transporter.sendMail(mailOptions);
};

export default sendSubscribeMail;