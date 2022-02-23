import { resolve } from "path";
import { glob } from "./utils/glob-promise";
import { Notifier } from "./notifications";
import { millisecondsToStr } from "./utils/time";

export type RunPage = {
  name?: string;
  options: RunOptions;
  run(): Promise<void>;
};

export type RunOptions = {
  notifiers?: Notifier[];
  interval: number;
};

export type ExecuteOptions = {
  dir: string;
  globPath?: string;
  notifiers?: Notifier[];
};

let alive = true;

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchRuns(globPath: string, dir: string) {
  const files = await glob(globPath);
  const imports = await Promise.all(files.map(f => import(resolve(dir, "../", f))));
  return imports.map((r: RunPage, idx) => ({
    name: r.name ?? files[idx],
    run: r.run,
    options: r.options,
  }));
}

async function sendNotifications(title: string, body: string, notifiers: Notifier[]) {
  for (const notify of notifiers) {
    await notify.send({ title, body }).catch(console.error);
  }
}

const errorMap = new Map<string, Date>();

async function recursiveRun(page: Required<RunPage>, globalNotifiers: Notifier[] = []) {
  const { name, run, options } = page;
  const notifiers = options.notifiers ?? globalNotifiers;

  const errorStartTime = errorMap.get(name);

  try {
    await run();

    if (errorStartTime) {
      errorMap.delete(name);
      const message = `Run is back online! was down for ${millisecondsToStr(errorStartTime.getTime())}`;
      await sendNotifications(name, message, notifiers);
    }
  } catch (err) {
    // if we have already notified about the error,
    // wait until success before sending another notification
    if (!errorStartTime) {
      errorMap.set(name, new Date());
      await sendNotifications(name, err.message, notifiers);
    }
  }

  if (alive) {
    await sleep(options.interval * 1000);
    await recursiveRun({ name, run, options }, notifiers);
  }
}

export async function executeJobs(options: ExecuteOptions) {
  const {
    dir,
    notifiers = [],
    globPath = "runs/**/*.{js,ts}",
  } = options;
  const runs = await fetchRuns(globPath, dir);
  await Promise.allSettled(runs.map(run => recursiveRun(run, notifiers)));
}

function shutdown() {
  alive = false;
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
