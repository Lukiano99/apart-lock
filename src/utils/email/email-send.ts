import { env } from "@/env";
import { SendEmailType } from "@/schemas/email";
import nodemailer from "nodemailer";
import { createPasswordEmailTemplate } from "./email-template";

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

export const sendPasswordThroughGmail = async ({
  to,
  password,
  customerName,
  customerId,
  reservationId,
  createdAt,
  checkInDate,
  checkOutDate,
  price,
}: SendEmailType) => {
  const info = await transporter.sendMail({
    from: '"ApartLock Admin 🔑" <noreply@apartlock.com>', // sender address
    to: to,
    subject: `ŠIFRA APARTMANA | [${env.NODE_ENV}]`, // Subject line
    cc: config.cc_emails,
    html: createPasswordEmailTemplate({
      password,
      customerName,
      customerId,
      reservationId,
      createdAt,
      checkInDate,
      checkOutDate,
      price,
    }),
  });
  console.log({ info });
  return info;
};
