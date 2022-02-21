import { executeJobs } from "@js-watcher/core";

executeJobs("runs/**/*.ts", __dirname).catch(err => {
  console.error(err);
  process.exit(1);
})
