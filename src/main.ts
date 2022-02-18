import "dotenv/config";

import { interval } from "rxjs";

import { glob } from "./glob-promise";
import { sendNotification } from "./pushover";

void (async function () {
  const files = await glob("runs/**/*.ts");
  const toImport = files.map(f => import(`../${f}`));
  const runs = await Promise.all(toImport);
  const timer = interval(10000);

  timer.subscribe(async () => {
    const toRun = runs.map(r => r.run());
    const result = await Promise.allSettled(toRun);

    for (const r of result) {
      if (r.status === "rejected") {
        console.log("FAILED", r.reason.message);
        await sendNotification("js-watcher", r.reason.message);
      }
    }
  });
}());
