import { chromium } from "playwright";
import { RunOptions } from "@promise-watch/core";

export const options: RunOptions = {
  interval: 7.5,
};

export async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const response = await page.goto("https://jasonraimondi.com", { waitUntil: "domcontentloaded" });

  if (response?.status && response.status() > 399) {
    throw new Error(`Failed with response code [${response.status()}].`);
  }

  await page.close({ runBeforeUnload: true });
  await browser.close();
}
