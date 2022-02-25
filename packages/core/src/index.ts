import { haltRecursion, recursivelyRun } from "./recursively-run";
import { ExecuteOptions } from "./types";
import { importRunsFromPath } from "./import-runs";
import { filterRunsWithoutRequiredFields } from "./filter-runs";

export * from "./notifiers/console-notifier"
export * from "./types";

export async function executeJobs(options: ExecuteOptions) {
  const {
    dir,
    notifiers = [],
    globPath = "runs/**/*.{js,ts}",
  } = options;
  const files = await importRunsFromPath(globPath, dir);
  const runs = filterRunsWithoutRequiredFields(files);
  await Promise.allSettled(runs.map(run => recursivelyRun(run, notifiers)));
}

function shutdown() {
  haltRecursion();
  console.log("HALTING RECURSION");
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
