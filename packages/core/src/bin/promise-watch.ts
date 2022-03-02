import "ts-node/register"

import { executeJobs } from "../execute";

(async function () {
  const dir = process.cwd();

  const config = await import(`${dir}/promise-watch.config.ts`);

  const options = { dir, ...config.default };

  console.log(options);

  await executeJobs(options);
})().catch(err => {
  console.error(err);
  process.exit(1);
});
