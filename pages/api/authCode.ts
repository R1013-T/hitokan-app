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

  // 認証コードメール
  const authCodeMailData = {
    from: "hitokan.auto@gmail.com",
    to: req.body.email,
    subject: "ヒトカン - 認証コード",
    text: `aaa`,
    html: `
      <p>ヒトカン - 認証コード</p>
      <p>${req.body.authCode}</p>
    `
  }

  transporter.sendMail(authCodeMailData, function(err, info) {
    if (err) console.log(err)
    else console.log(info)
  })
}
