import { env } from "@/env";
import { SendEmailType } from "@/schemas/email";
import nodemailer from "nodemailer";
import { createPasswordEmailTemplate } from "./email-template";

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
    subject: "ŠIFRA APARTMANA", // Subject line
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
  return info;
};
