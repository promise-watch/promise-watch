import "dotenv/config";

import { ConsoleNotifier, executeJobs, ExecuteOptions } from "@promise-watch/core";
// import { PushoverNotifier } from "@promise-watch/pushover";
// import { SlackNotifier } from "@promise-watch/slack";

const options: ExecuteOptions = {
  dir: __dirname,
  notifiers: [
    new ConsoleNotifier(),
    // new PushoverNotifier(process.env.PUSHOVER_USER_KEY!, process.env.PUSHOVER_API_KEY!),
    // new SlackNotifier(process.env.SLACK_WEBHOOK_URL!),
  ],
};

executeJobs(options).catch(err => {
  console.error(err);
  process.exit(1);
});
