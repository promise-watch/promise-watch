# @promise-watch/pushover

## Installation

```bash
pnpm add @promise-watch/pushover
```

## Usage

```typescript
import { PushoverNotifier } from "@promise-watch/pushover";

const options: ExecuteOptions = {
  dir: __dirname,
  errorNotifiers: [
    new PushoverNotifier({
      apiKey: process.env.PUSHOVER_API_KEY!,
      userKey: process.env.PUSHOVER_USER_KEY!,
    }),
  ],
};

executeJobs(options);
```

### Extended Configuration

```typescript
import { PushoverNotifier, PushoverOptions } from "@promise-watch/pushover";

const pushoverOptions: PushoverOptions = {
  apiKey: process.env.PUSHOVER_API_KEY!,
  userKey: process.env.PUSHOVER_USER_KEY!,
  priority: {
    priority: 1,
    retry: 2,
  },
  sound: 'bike',
}

const options: ExecuteOptions = {
  dir: __dirname,
  errorNotifiers: [
    new PushoverNotifier(pushoverOptions),
  ],
};
```