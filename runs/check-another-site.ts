import { chromium } from "playwright";

export const options = {
  interval: 5000,
};

export async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const response = await page.goto("https://jasonraimondi.com", { waitUntil: "domcontentloaded" });
  const status = response?.status() ?? 1000;

  if (status > 399) {
    throw new Error(`Failed with response code [${status}].`);
  }
  // await page.screenshot({ path: `tmp/screenshots/${new Date().toISOString()}-${basename(__filename)}.jpg` });

  await page.close({ runBeforeUnload: true });
  await browser.close();
}
