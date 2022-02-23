# @promise-watch/slack

## Installation 

```bash
pnpm add @promise-watch/slack
```

## Usage

```typescript
const options: ExecuteOptions = {
  dir: __dirname,
  errorNotifiers: [
    new SlackNotifier(process.env.SLACK_WEBHOOK_URL),
  ],
};

executeJobs(options);
```

### Extended Configuration

```typescript
import { SlackNotifier } from "@promise-watch/slack";
import type { IncomingWebhookSendArguments } from "@slack/webhook";

const slackOptions: IncomingWebhookSendArguments = {
  channel: "#general",
  username: "Promise Watch",
  icon_emoji: ":ghost:",
};

const options: ExecuteOptions = {
  dir: __dirname,
  errorNotifiers: [
    new SlackNotifier(process.env.SLACK_WEBHOOK_URL, slackOptions),
  ],
};
```