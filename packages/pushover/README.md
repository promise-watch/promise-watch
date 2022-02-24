# @promise-watch/pushover

## Installation

```bash
pnpm add @promise-watch/pushover
```

## Usage

```typescript
import { PushoverNotifier } from "@promise-watch/pushover";

new PushoverNotifier({
  apiKey: process.env.PUSHOVER_API_KEY!,
  userKey: process.env.PUSHOVER_USER_KEY!,
});
```

### Extended Configuration

See [index.ts](https://github.com/jasonraimondi/promise-watch/blob/master/packages/pushover/src/index.ts) for full options.

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

new PushoverNotifier(pushoverOptions);
```
