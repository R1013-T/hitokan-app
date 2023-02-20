import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default function sendGmail(req: NextApiRequest, res: NextApiResponse) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const authMailData = {
    from: process.env.GMAIL_USER,
    to: req.body.email,
    subject: "Sign up to HITOKAN",
    html: `
      <p>ヒトカン 認証メール</p>
      <p>${req.body.id}</p>
      <a href="${req.body.url}">クリック</a>
    `,
  };

  transporter.sendMail(authMailData, function (err, info) {
    if (err) console.log(err);
    else console.log(info);
  });
}
