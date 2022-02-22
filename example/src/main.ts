import "dotenv/config";

import { executeJobs, ExecuteOptions } from "@js-watcher/core";
import { PushoverNotifier } from "@js-watcher/pushover";
// import { SlackNotifier } from "@js-watcher/slack";
// import { SmtpNotifer } from "@js-watcher/smtp";

const options: ExecuteOptions = {
  dir: __dirname,
  errorNotifiers: [
    new PushoverNotifier(process.env.PUSHOVER_USER_KEY!, process.env.PUSHOVER_API_KEY!),
    // new SlackNotifier(process.env.SLACK_WEBHOOK_URL!),
    // new SmtpNotifer({
    //   host: process.env.SMTP_HOST,
    //   port: Number(process.env.SMTP_PORT) || 587,
    // }, {
    //   to: process.env.SMTP_TO,
    //   from: process.env.SMTP_FROM,
    // }),
  ],
};

executeJobs(options).catch(err => {
  console.error(err);
  process.exit(1);
});
