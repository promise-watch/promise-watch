import "dotenv/config";

import { ConsoleNotifier, executeJobs, ExecuteOptions } from "@promise-watch/core";
import { PushoverNotifier } from "@promise-watch/pushover";
import { SlackNotifier } from "@promise-watch/slack";
import { SmtpNotifier } from "@promise-watch/smtp";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import type Mail from "nodemailer/lib/mailer";

const smtpOptions: SMTPTransport | SMTPTransport.Options | string = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
};

const mailOptions: Mail.Options = {
  to: process.env.SMTP_TO,
  from: process.env.SMTP_FROM,
};

const options: ExecuteOptions = {
  dir: __dirname,
  notifiers: [
    new ConsoleNotifier(),
    new PushoverNotifier({
      apiKey: process.env.PUSHOVER_API_KEY!,
      userKey: process.env.PUSHOVER_USER_KEY!,
    }),
    new SlackNotifier(process.env.SLACK_WEBHOOK_URL!),
    new SmtpNotifier(smtpOptions, mailOptions),
  ],
};

executeJobs(options).catch(err => {
  console.error(err);
  process.exit(1);
});
