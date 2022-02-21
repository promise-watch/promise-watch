import { resolve } from "path";
import { catchError, defer, delay, repeatWhen } from "rxjs";

import { glob } from "./utils/glob-promise";
import { Notifier } from "./notifications";

export type RunPage = {
  options: RunOptions;
  run(): Promise<void>;
}

export type RunOptions = {
  errorNotifiers?: Notifier[];
  interval: number;
}

export type ExecuteOptions = {
  dir: string;
  globPath?: string;
  errorNotifiers?: Notifier[];
}

export async function executeJobs({ dir, errorNotifiers = [], globPath = "runs/**/*.{js,ts}" }: ExecuteOptions) {
  const files = await glob(globPath);
  const imports = await Promise.all(files.map(f => import(resolve(dir, "../", f))));
  const runs = imports.map((r: RunPage, idx) => ({
    name: files[idx],
    run: r.run,
    options: r.options,
  }));

  async function sendErrorNotifications(title: string, body: string, customNotifiers?: Notifier[]) {
    for (const notify of (customNotifiers ?? errorNotifiers)) {
      await notify.send({ title, body });
    }
  }

  for (const { name, run, options } of runs) {
    defer(() => run())
      .pipe(
        repeatWhen(next => next.pipe(delay(options.interval * 1000))),
        catchError(err => sendErrorNotifications(name, err.message, options.errorNotifiers)),
      )
      .subscribe();
  }
}