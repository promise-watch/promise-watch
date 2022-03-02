import { recursivelyRun } from "./recursively-run";
import { filterRunsWithoutRequiredFields } from "./filter-runs";
import { ExecuteOptions } from "./types";
import { importRunsFromPath } from "./import-runs";

export async function executeJobs(options: ExecuteOptions) {
  const { dir, notifiers = [], globPath = "runs/**/*.{js,ts}" } = options;
  let runs = await importRunsFromPath(globPath, dir);
  runs = filterRunsWithoutRequiredFields(runs);
  await Promise.allSettled(runs.map(run => recursivelyRun(run, notifiers)));
}
