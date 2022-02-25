import { haltRecursion, recursivelyRun } from "./run";
import { ExecuteOptions } from "./types";
import { importRunsFromPath } from "./files";
import { filterRunsWithoutRequiredFields } from "./execute";

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
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
