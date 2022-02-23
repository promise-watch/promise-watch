# @promise-watch/pushover

## Installation 

```bash
pnpm add @promise-watch/pushover
```

## Usage

```typescript
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
const options: ExecuteOptions = {
  dir: __dirname,
  errorNotifiers: [
    new PushoverNotifier({
      apiKey: process.env.PUSHOVER_API_KEY!,
      userKey: process.env.PUSHOVER_USER_KEY!,
      priority: {
        priority: 1,
        retry: 2,
      },
      sound: 'bike',
    }),
  ],
};
```