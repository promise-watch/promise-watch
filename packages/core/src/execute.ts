import { recursivelyRun } from "./recursively-run";
import { filterRunsWithoutRequiredFields } from "./filter-runs";
import { ExecuteOptions, PromiseWatchOptions } from "./types";
import { importRunsFromPath } from "./import-runs";

export async function executeJobs(options: PromiseWatchOptions | ExecuteOptions) {
  const { notifiers = [], globPath = "runs/**/*.{js,ts}" } = options;
  let runs = await importRunsFromPath(globPath);
  runs = filterRunsWithoutRequiredFields(runs);
  await Promise.allSettled(runs.map(run => recursivelyRun(run, notifiers)));
}
