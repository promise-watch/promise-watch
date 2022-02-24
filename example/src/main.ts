import "dotenv/config";

import { ConsoleNotifier, executeJobs, ExecuteOptions } from "@promise-watch/core";
// import { PushoverNotifier } from "@promise-watch/pushover";
import { SlackNotifier } from "@promise-watch/slack";

const options: ExecuteOptions = {
  dir: __dirname,
  notifiers: [
    new ConsoleNotifier(),
    // new PushoverNotifier({
    //   apiKey: process.env.PUSHOVER_API_KEY!,
    //   userKey: process.env.PUSHOVER_USER_KEY!,
    //   priority: {
    //     priority: 2,
    //   }
    // }),
    new SlackNotifier(process.env.SLACK_WEBHOOK_URL!),
  ],
};

executeJobs(options).catch(err => {
  console.error(err);
  process.exit(1);
});
