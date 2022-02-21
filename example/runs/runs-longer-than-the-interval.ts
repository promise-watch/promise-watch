import { RunOptions } from "@js-watcher/core";

export const options: RunOptions = {
  interval: 3.75,
};

export async function run() {
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  console.log("before delay");
  await sleep(8000);
  console.log("end delay");
}
