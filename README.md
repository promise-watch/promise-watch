# js-watcher

Write playwright scripts, set options, send notifications.

## Getting Started

Make a new project directory

```bash
mkdir -p my-watchers/{runs/src}
cd my-watchers
git init
pnpm init -y
```

Install dependencies

```bash
pnpm add @js-watcher/core playwright
pnpm add -D typescript ts-node @types/node
```

Next, create a sample run. A run requires two exports: `options: { interval: number; }` and `run: Promise<void>`. For each 

```typescript
// runs/checks-jasonraimondi-com.ts
export const options = {
  interval: 30, // in seconds
}

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

  console.log(`success: ${__filename}`);
}
```

Add an entrypoint

```typescript
import { executeJobs } from "@js-watcher/core";

executeJobs("runs/**/*.ts", __dirname).catch(err => {
  console.error(err);
  process.exit(1);
})
```

And a run script

```json
{
  "scripts": {
    "start": "ts-node src/main.ts"
  }
}
```

And go

```bash
pnpm start
```

## Caveats

I have a feeling this isnt gonna scale nicely. I am planning on only using this for ~5 runs so we'll see how it goes.
