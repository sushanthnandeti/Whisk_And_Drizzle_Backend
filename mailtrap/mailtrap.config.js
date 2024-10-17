import Nodemailer from "nodemailer";
import { MailtrapTransport } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

const TOKEN ="af540cc773de839d6d93bfec2482c584"

export const mailtrapClient = Nodemailer.createTransport(
  MailtrapTransport({
    token: TOKEN,
  })
);

export const sender = {
  address: "hello@demomailtrap.com",
  name: "Whisk and Drizzle Team",
};

