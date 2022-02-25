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
  return imports.map(({ name, run, options }: RunPage, idx) => {
    name = name ?? files[idx].replace("runs/", "")
    return { name, run, options }
  }).reduce((prev, next) => {
    const errors = [];

    if (typeof next.run !== "function") errors.push(`* missing required export async function run()`);
    if (typeof next.options?.interval !== "number") errors.push(`* missing required export const option.interval`);

    if (errors.length) {
      console.log(`${next.name} has errors and was skipped:`);
      console.log(errors.join("\n"), "\n");
      return [...prev];
    }

    return [...prev, next];
  }, [] as Required<RunPage>[])
}

type SendNotifications = { title: string; body: string; notifiers: Notifier[]; isSuccess?: boolean; }

async function sendNotifications({ title, body, notifiers, isSuccess = false }: SendNotifications) {
  for (const notify of notifiers) {
    await notify.send({ title, body, isSuccess }).catch(console.error);
  }
}

const errors: Record<string, number> = {};

async function recursiveRun(page: Required<RunPage>, globalNotifiers: Notifier[] = []) {
  const { name, run, options } = page;
  const notifiers = options.notifiers ?? globalNotifiers;

  try {
    await run();

    if (errors[name]) {
      const message = `Recovered after ${millisecondsToStr(errors[name])}`;
      await sendNotifications({
        title: name,
        body: message,
        notifiers,
        isSuccess: true,
      });
      delete errors[name];
    }
  } catch (err: any) {

    // if we have already notified about the error,
    // wait until success before sending another notification
    if (!errors[name]) {
      errors[name] = Date.now();
      await sendNotifications({
        title: name,
        body: err.message,
        notifiers,
      });
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
