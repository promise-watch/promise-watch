import { RunOptions } from "@promise-watch/core";

export const options: RunOptions = {
  interval: 4,
};

export async function run() {
  throw new Error("this is an error");
}
