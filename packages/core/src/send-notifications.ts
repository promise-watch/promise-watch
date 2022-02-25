import { Notifier, SendNotifications } from "./types";
import { howLongAgo } from "./utils/time";


async function sendNotifications({ title, body, notifiers, isSuccess = false }: SendNotifications) {
  for (const notify of notifiers) {
    await notify.send({ title, body, isSuccess }).catch(console.error);
  }
}

const errors: Record<string, number> = {};

export async function sendErrorNotifications(title: string, body: any, notifiers: Notifier[]) {
  // if we have already notified about the error, wait until success before sending another notification
  if (!errors[title]) {
    errors[title] = Date.now();
    await sendNotifications({ title, body, notifiers });
  }
}

export async function sendSuccessNotifications(title: string, notifiers: Notifier[]) {
  if (errors[title]) {
    const body = `Recovered after ${howLongAgo(errors[title])}`;
    await sendNotifications({ title, body, notifiers, isSuccess: true });
    delete errors[title];
  }
}