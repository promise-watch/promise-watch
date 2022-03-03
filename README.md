<h1 align="center">
  	<img height="180" src="https://github.com/jasonraimondi/promise-watch/raw/master/logos/promise-watch-logo-vertical.png" alt="Promise Watch Logo" />
</h1>

[![Tests](https://github.com/jasonraimondi/promise-watch/actions/workflows/test.yml/badge.svg)](https://github.com/jasonraimondi/promise-watch/actions/workflows/test.yml)
[![License](https://img.shields.io/github/license/jasonraimondi/promise-watch?color=#31C754)](./LICENSE.md)

[![@promise-watch/core](https://img.shields.io/npm/v/@promise-watch/core?label=%40promise-watch%2Fcore)](https://www.npmjs.com/package/@promise-watch/core)
[![@promise-watch/axios](https://img.shields.io/npm/v/@promise-watch/axios?label=%40promise-watch%2Faxios)](https://www.npmjs.com/package/@promise-watch/axios)
[![@promise-watch/pushover](https://img.shields.io/npm/v/@promise-watch/pushover?label=%40promise-watch%2Fpushover)](https://www.npmjs.com/package/@promise-watch/pushover)
[![@promise-watch/slack](https://img.shields.io/npm/v/@promise-watch/slack?label=%40promise-watch%2Fslack)](https://www.npmjs.com/package/@promise-watch/slack)
[![@promise-watch/smtp](https://img.shields.io/npm/v/@promise-watch/smtp?label=%40promise-watch%2Fsmtp)](https://www.npmjs.com/package/@promise-watch/smtp)

An Api/E2E monitor that runs promises on intervals and sends notifications on errors. Supports [playwright](https://playwright.dev/) for reliable E2E testing. Has prebuilt [notifiers](#notifiers) for [SMTP](./packages/smtp), [Slack](./packages/slack), and [Pushover](./packages/pushover), and can support any [custom notifier](#custom-notifiers).

Create a `run` directory where you write scripts, set options, then send notifications on errors. Checkout the [example dir](./example) to see a working example.

```
./my-e2e-checks/
├── runs/
│   ├── checks-https-jasonraimondi-com.ts
│   └── checks-https-google-com.ts
├── promise-watch.config.ts
└── package.json
```

Your runs can be anything! It just needs to export an `options: RunPageOptions` and `run: Promise<void>`.

```typescript
import { chromium } from "playwright";
import { RunPageOptions } from "@promise-watch/core";

export const options: RunPageOptions = {
  interval: 15,
};

export async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const response = await page.goto("https://jasonraimondi.com");

  if (response?.status && response.status() > 399) {
    throw new Error(`Failed with response code [${response.status()}].`);
  }

  await page.close({ runBeforeUnload: true });
  await browser.close();
}
```

Really, you can put anything in the promise.

```typescript
export const options = {
  interval: 15,
};

export async function run() {
  // you can run anything here... if it throws an error, it will send a notification.
}
```

## Getting Started

The best way to get started is to use the [starter-template](https://github.com/promise-watch/starter-template). Clone it down and then add your own custom runs to the `runs/` directory.

## Configuration

The default options:

```typescript
type RunPageOptions = {
  interval: number; // required
  notifiers?: Notifier[]; // default: []
  logSuccess?: boolean; // default: false
  retryImmediatelyAfterFail?: boolean; // default: false
};
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

const options: ExecuteOptions = {
  ...,
  notifiers: [
    new ConsoleNotifier(),
    ...
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
  sendError(options: SendOptions): Promise<void>;
  sendRecovered(options: SendOptions): Promise<void>;
}
```

## API Monitoring

Since it is just a Promise with errors being thrown, you can opt to just have a run that just makes an http api request to an endpoint. There is a helper package [`@promise-watch/axois`](./run/axios) that has a small helper for that.

```typescript
import { checkHttp } from "@promise-watch/axios";

export const options = {
  interval: 30,
}

export async function run() {
  await checkHttp(new URL("https://jasonraimondi.com"));
}
```

## Caveats

For now, this is not going scale to many runs nicely. I'm not sure the limit, but with enough runs, someone will surely find out for us!
