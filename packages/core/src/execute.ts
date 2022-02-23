import { resolve } from "path";
import { glob } from "./utils/glob-promise";
import { Notifier } from "./notifications";

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

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let alive = true;

async function fetchRuns(globPath: string, dir: string) {
  const files = await glob(globPath);
  const imports = await Promise.all(files.map(f => import(resolve(dir, "../", f))));
  return imports.map((r: RunPage, idx) => ({
    name: r.name ?? files[idx],
    run: r.run,
    options: r.options,
  }));
}

async function sendErrorNotifications(title: string, body: string, notifiers: Notifier[]) {
  for (const notify of notifiers) {
    await notify.send({ title, body });
  }
}

async function recursiveRun(page: Required<RunPage>, notifiers: Notifier[] = []) {
  const { name, run, options } = page;

  try {
    await run();
  } catch (err) {
    await sendErrorNotifications(name, err.message, options.notifiers ?? notifiers).catch(console.error);
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
