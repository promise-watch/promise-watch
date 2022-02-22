import { resolve } from "path";
import { glob } from "./utils/glob-promise";
import { Notifier } from "./notifications";

export type RunPage = {
  name?: string;
  options: RunOptions;
  run(): Promise<void>;
};

export type RunOptions = {
  errorNotifiers?: Notifier[];
  interval: number;
};

export type ExecuteOptions = {
  dir: string;
  globPath?: string;
  errorNotifiers?: Notifier[];
};

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let alive = true;

export async function executeJobs({ dir, errorNotifiers = [], globPath = "runs/**/*.{js,ts}" }: ExecuteOptions) {
  const files = await glob(globPath);
  const imports = await Promise.all(files.map(f => import(resolve(dir, "../", f))));
  const runs = imports.map((r: RunPage, idx) => ({
    name: r.name ?? files[idx],
    run: r.run,
    options: r.options,
  }));

  async function sendErrorNotifications(title: string, body: string, customNotifiers?: Notifier[]) {
    for (const notify of customNotifiers ?? errorNotifiers) {
      await notify.send({ title, body });
    }
  }

  async function extracted({ name, run, options }: Required<RunPage>) {
    try {
      await run();
    } catch (err) {
      await sendErrorNotifications(name, err.message, options.errorNotifiers);
    }

    if (alive) {
      await sleep(options.interval * 1000);
      await extracted({ name, run, options });
    }
  }

  await Promise.allSettled(runs.map(run => extracted(run)));
}

function shutdown() {
  alive = false;
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
