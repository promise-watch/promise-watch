# js-watcher

An E2E monitor that runs Playwright to monitor your frontend application.

Write whatever promise based checks you want, and if an error gets thrown, you can send notifications using several different notifiers. 

Create a `run` directory where you write playwright scripts, set options, then send notifications on errors. Checkout the [example dir](./example) to see a working example.

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
pnpm add @promise-watch/core playwright
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
const options: ExecuteOptions = {
  dir: __dirname,
  errorNotifiers: [
    // the ConsoleNotifier logs errors to the console
    new ConsoleNotifier(),
  ],
};

executeJobs(options).catch(err => {
  console.error(err);
  process.exit(1);
});
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

## Notifiers

Send notifications when errors occur using the following providers:

* [Pushover](./packages/pushover)
* [Slack](./packages/slack)
* [SMTP](./packages/smtp)

```bash
pnpm add @promise-watch/pushover @promise-watch/slack @promise-watch/smtp
```

Then in your execute options, add the `PushoverNotifier` to your `errorNotifiers` array.

```typescript
import { PushoverNotifier } from "@promise-watch/pushover";
import { SlackNotifier } from "@promise-watch/slack";
import { SmtpNotifier } from "@promise-watch/smtp";

const options: ExecuteOptions = {
  ...,
  errorNotifiers: [
    new PushoverNotifier(process.env.PUSHOVER_USER_KEY, process.env.PUSHOVER_API_KEY),
    new SlackNotifier(process.env.SLACK_WEBHOOK_URL),
    new SmtpNotifier(...),
  ]
}
```

### Custom Notifiers

Implement the Notifier type and you're good to go. See the [pushover notifier](./packages/pushover/src/main.ts) for a working example. Feel free to submit a PR if you want to add support for a custom notifier.

```typescript
export type SendOptions = {
  title: string;
  body: string;
}

export type Notifier = {
  send(options: SendOptions): Promise<void>;
}
```

## Caveats

I have a feeling this isnt gonna scale nicely. I am planning on only using this for ~5 runs so we'll see how it goes.
