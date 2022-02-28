import { recursivelyRun } from "./recursively-run";
import { ExecuteOptions } from "./types";
import { importRunsFromPath } from "./import-runs";
import { filterRunsWithoutRequiredFields } from "./filter-runs";

export * from "./notifiers/console-notifier";
export * from "./types";

export async function executeJobs(options: ExecuteOptions) {
  const { dir, notifiers = [], globPath = "runs/**/*.{js,ts}" } = options;
  let runs = await importRunsFromPath(globPath, dir);
  runs = filterRunsWithoutRequiredFields(runs);
  await Promise.allSettled(runs.map(run => recursivelyRun(run, notifiers)));
}
