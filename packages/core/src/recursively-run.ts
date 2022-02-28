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

  const runAttempt = async () => {
    await run();
    await sendSuccessNotifications(name, notifiers);
  };

  let passed = false;

  // try runs twice before sending an error notification
  await runAttempt()
    .catch(() => {
      passed = false;
      return runAttempt();
    })
    .catch(err => sendErrorNotifications(name, err.message, notifiers));

  // passed                            wait
  // failed tryAgainImmediately: false wait
  // failed tryAgainImmediately: true  no-wait

  if (alive) {
    if (passed) {
      await sleep(options.interval * 1000);
      await recursivelyRun(page, notifiers);
      return;
    }

    if (!options.tryAgainImmediately) {
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
