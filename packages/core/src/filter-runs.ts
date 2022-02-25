import { RunPage } from "./types";

// since runs are just arbitrarily imported files, we need to do some
// runtime checks to verify the required exports are included
export function filterRunsWithoutRequiredFields(pages: RunPage[]): RunPage[] {
  return pages.reduce((prev, next) => {
    const errors = [];

    if (typeof next.run !== "function") errors.push(`* missing required export async function run()`);
    if (typeof next.options?.interval !== "number") errors.push(`* missing required export const option.interval`);

    if (errors.length) {
      console.log(`${next.name} has errors and was skipped:`)
      console.log(errors.join("\n"), "\n");
      return [...prev];
    }

    return [...prev, next];
  }, [] as RunPage[]);

}
