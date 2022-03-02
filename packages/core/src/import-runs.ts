import { glob } from "./utils/glob-promise";
import { resolve } from "path";
import { RunPage } from "./types";

export async function importRunsFromPath(globPath: string, dir: string): Promise<RunPage[]> {
  const files = await glob(globPath);
  const promises = files.map(f => resolve(dir, f));
  const imports = await Promise.all(promises.map(f => import(f)));
  return imports.map((page, idx) => ({
    name: page.name ?? files[idx].replace("runs/", ""),
    run: page.run,
    options: page.options,
  }));
}
