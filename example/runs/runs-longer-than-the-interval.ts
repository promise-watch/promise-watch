import { RunOptions } from "@promise-watch/core";

export const options: RunOptions = {
  interval: 3.75,
};

export async function run() {
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  await sleep(8000);
}
