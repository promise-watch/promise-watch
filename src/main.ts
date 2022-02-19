import "dotenv/config";

import { catchError, defer, delay, repeatWhen } from "rxjs";

import { glob } from "./utils/glob-promise";
import { sendNotification } from "./notifications/pushover";

void (async function () {
  const files = await glob("runs/**/*.ts");
  const imports = await Promise.all(files.map(f => import(`../${f}`)));
  const runs = imports.map((r, idx) => ({ name: files[idx], run: r.run, options: r.options });

  for (const { name, run, options } of runs) {
    defer(() => run())
      .pipe(
        catchError(err => sendNotification(name, err.message)),
        repeatWhen(run => run.pipe(delay(options.interval))),
      ).subscribe();
  }
}());
