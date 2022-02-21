import "dotenv/config"

import { executeJobs, ExecuteOptions } from "@js-watcher/core";
import { PushoverNotifier } from "@js-watcher/pushover";

const options: ExecuteOptions = {
  dir: __dirname,
  errorNotifiers: [
    new PushoverNotifier(process.env.PUSHOVER_USER_KEY!, process.env.PUSHOVER_API_KEY!),
  ]
}

executeJobs(options).catch(err => {
  console.error(err);
  process.exit(1);
})
