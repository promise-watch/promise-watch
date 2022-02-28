# @promise-watch/axios

## Installation 

```bash
pnpm add @promise-watch/axios
```

## Usage

```typescript
import { checkURL } from "@promise-watch/axios";

export async function run() {
  await checkURL(new URL("https://jasonraimondi.com"));
}
```
