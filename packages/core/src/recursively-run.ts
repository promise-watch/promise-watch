import { Notifier, RunPage } from "./types";
import { sleep } from "./utils/sleep";
import { sendErrorNotifications, sendSuccessNotifications } from "./send-notifications";

let alive = true;

export function haltRecursion() {
  alive = false;
}

export async function recursivelyRun(page: RunPage, notifiers: Notifier[] = []) {
  const { name, run, options } = page;
  notifiers = options.notifiers ?? notifiers;

  let passed = false;

  const runAttempt = async () => {
    await run();
    await sendSuccessNotifications(name, notifiers);
    passed = true;
  };

  // try runs twice before sending an error notification
  await runAttempt()
    .catch(() => {
      passed = false;
      return runAttempt();
    })
    .catch(err => {
      return sendErrorNotifications(name, err.message, notifiers)
    });

  if (alive) {
    if (passed) {
      await sleep(options.interval * 1000);
      await recursivelyRun(page, notifiers);
      return;
    }

    if (options.retryImmediatelyAfterFail !== true) {
      await sleep(options.interval * 1000);
    }

    await recursivelyRun(page, notifiers);
  }
}

function shutdown() {
  haltRecursion();
  console.log("HALTING RECURSION");
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
