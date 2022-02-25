import { glob } from "./utils/glob-promise";
import { resolve } from "path";
import { RunPage } from "./types";

export async function importRunsFromPath(globPath: string, dir: string): Promise<RunPage[]> {
  const files = await glob(globPath);
  const imports = await Promise.all(files.map(f => import(resolve(dir, "../", f))));
  return imports.map((page, idx) => ({
    name: page.name ?? files[idx].replace("runs/", ""),
    run: page.run,
    options: page.options,
  }));
}
