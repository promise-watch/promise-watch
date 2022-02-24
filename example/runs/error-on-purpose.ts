import { RunOptions } from "@promise-watch/core";

export const options: RunOptions = {
  interval: 15,
};

export async function run() {
  if (Math.random() * 100 > 70) {
    throw new Error("this is an error");
  } else {
    console.log("SUCCESS");
  }
}
