import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { env } from "@/env";
import nodemailer from "nodemailer";

const config = {
  user: env.EMAIL_APP_USER,
  password: env.EMAIL_APP_PWD,
};
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.user,
    pass: config.password,
  },
});

export const emailRouter = createTRPCRouter({
  send: publicProcedure.mutation(async ({ ctx, input }) => {
    const TEMPORARY_PASSWORD = "1234567";
    const info = await transporter.sendMail({
      from: '"ApartLock Admin 🔑" <noreply@apartlock.com>', // sender address
      cc: ["dimitrije.peric@hotmail.com", "l.stojadinovic99@gmail.com"],
      subject: "GMAIL service test", // Subject line
      date: new Date().toLocaleDateString(),
      html: `<html lang="rs">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Privremena Šifra</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <table width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
          
              <tr>
                  <td style="padding: 20px; text-align: center;">
                      <h2 style="color: #333333;">Poštovani korisniče,</h2>
                      <p style="color: #555555; font-size: 16px;">
                          Ovo je Gmail test
                      </p>
                      <p style="color: #1a73e8; font-size: 24px; font-weight: bold; text-align: center; margin-top: 20px;">
                          ${TEMPORARY_PASSWORD}
                      </p>
                      <p style="color: #555555; font-size: 14px; margin-top: 40px;">
                          Ovo je test sifra.
                      </p>
                  </td>
              </tr>
          </table>
      </body>
      </html>`,
    });
    console.log({ info });
    return info;
  }),
});

/*


import { env } from "@/env";
import nodemailer from "nodemailer";

const config = {
  user: env.NEXT_PUBLIC_EMAIL_APP_USER,
  password: env.NEXT_PUBLIC_EMAIL_APP_PWD,
};

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: config.user,
    pass: config.password,
  },
});

export const sendNodemailerEmail = async () => {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Lukiano ApartLock App 👻" <noreply@apartlock.com>', // sender address
    to: "l.stojadinovic99@gmail.com.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });
  return info;
};
 */
