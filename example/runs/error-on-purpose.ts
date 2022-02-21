import { RunOptions } from "@js-watcher/core";

export const options: RunOptions = {
  interval: 4,
};

export async function run() {
  throw new Error("this is an error");
}
