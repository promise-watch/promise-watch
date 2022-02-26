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

  // try runs twice before sending an error notification
  await runAttempt()
    .catch(() => runAttempt())
    .catch(err => sendErrorNotifications(name, err.message, notifiers));

  if (alive) {
    await sleep(options.interval * 1000);
    await recursivelyRun(page, notifiers);
  }
}
