/**
 * When developing this file, you need to build because
 * the bin script is loaded from ./dist/bin/promise-watch.js
 *
 * If anyone knows how to get this working with typescript
 * (similar to main vs publishConfig.main) that would be great.
 */

import "ts-node/register"

import { executeJobs } from "../execute";

(async function () {
  const dir = process.cwd();

  const config = await import(`${dir}/promise-watch.config.ts`);

  await executeJobs({ dir, ...config.default });
})().catch(err => {
  console.error(err);
  process.exit(1);
});
