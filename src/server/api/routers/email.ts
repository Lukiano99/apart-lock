import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { env } from "@/env";
import nodemailer from "nodemailer";

const config = {
  user: env.EMAIL_APP_USER,
  password: env.EMAIL_APP_PWD,
  cc_emails: env.CC_ADMIN_EMAILS,
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
    const info = await transporter.sendMail({
      from: '"ApartLock Admin 🔑" <noreply@apartlock.com>',
      cc: config.cc_emails,
      subject: `[${env.NODE_ENV}] | GMAIL service test`,
      html: generateTestHtmlEmailTemplate(),
    });
    console.log({ info });
    return info;
  }),
});

const generateTestHtmlEmailTemplate = () => {
  const html = `<html lang="rs">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Privremena Šifra</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <table width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      
          <tr>
              <td style="padding: 20px; text-align: center;">
                  <h2 style="color: #333333;">[${env.NODE_ENV}]</h2>
                  <p style="color: #555555; font-size: 16px;">
                      Ovo je Gmail test. 
                  </p>
                  <p style="color: #1a73e8; font-size: 24px; font-weight: bold; text-align: center; margin-top: 20px;">
                      ${1234567}
                  </p>
                  <p style="color: #555555; font-size: 14px; margin-top: 40px;">
                      Ovo je test sifra.
                  </p>
              </td>
          </tr>
      </table>
  </body>
  </html>`;

  return html;
};
