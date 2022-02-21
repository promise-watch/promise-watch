import "dotenv/config";

import { resolve } from "path";
import { catchError, defer, delay, repeatWhen } from "rxjs";

import { glob } from "./utils/glob-promise";

const sendNotification = async (title: string, message: string) => console.log(title, message);

export async function executeJobs(globPath: string, dir: string) {
  const files = await glob(globPath);
  const imports = await Promise.all(files.map(f => import(resolve(dir, "../", f))));
  const runs = imports.map((r, idx) => ({ name: files[idx], run: r.run, options: r.options }));

  for (const { name, run, options } of runs) {
    defer(() => run())
      .pipe(
        repeatWhen(next => next.pipe(delay(options.interval * 1000))),
        catchError(err => sendNotification(name, err.message)),
      )
      .subscribe();
  }
}
