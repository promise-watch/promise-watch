# Promise Watch

An Api/E2E monitor that runs promises on intervals and sends notifications on errors. Supports [playwright](https://playwright.dev/) for reliable E2E testing. Has prebuilt notifiers for [SMTP](./packages/smtp), [Slack](./packages/slack), and [Pushover](./packages/pushover), and can support any custom notifier.

Create a `run` directory where you write scripts, set options, then send notifications on errors. Checkout the [example dir](./example) to see a working example.

```
./my-e2e-checks
├── runs
│   ├── checks-https-jasonraimondi-com.ts
│   └── checks-https-google-com.ts
├── src
│   └── main.ts
└── package.json
```

Your runs can be anything! It just needs to export an `options: RunOptions` and `run: Promise<void>`.

```typescript
// runs/checks-https-jasonraimondi-com.ts

import { chromium } from "playwright";
import { RunOptions } from "@promise-watch/core";

export const options: RunOptions = {
  interval: 60, // in seconds
};

export async function run(): Promise<void> {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const site = "https://jasonraimondi.com";

  const response = await page.goto(site);

  if ((response?.status() ?? 1000) > 399) {
    throw new Error(`${site} Failed to load!`);
  }

  await page.close({ runBeforeUnload: true });
  await browser.close();

  console.log(`success: ${__filename}`);
}
```

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

Add an entrypoint

```typescript
const options: ExecuteOptions = {
  dir: __dirname,
  errorNotifiers: [
    // The ConsoleNotifier logs errors to the console
    // see below for other notifiers
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

* ConsoleNotifier
* [PushoverNotifier](./packages/pushover)
* [SlackNotifier](./packages/slack)
* [SmtpNotifier](./packages/smtp)

```bash
pnpm add @promise-watch/pushover @promise-watch/slack @promise-watch/smtp
```

Then in your execute options, add the `PushoverNotifier` to your `errorNotifiers` array.

```typescript
import { ConsoleNotifier } from "@promise-watch/core";
import { PushoverNotifier } from "@promise-watch/pushover";
import { SlackNotifier } from "@promise-watch/slack";
import { SmtpNotifier } from "@promise-watch/smtp";

const options: ExecuteOptions = {
  ...,
  errorNotifiers: [
    new ConsoleNotifier(),
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
  isSuccess?: boolean;
}

export type Notifier = {
  send(options: SendOptions): Promise<void>;
}
```

## Caveats

I have a feeling this isnt gonna scale nicely.
