import { Pushover } from "pushover-js";

const pushover = new Pushover(
  process.env.PUSHOVER_USER_KEY!,
  process.env.PUSHOVER_API_KEY!,
);

export async function sendNotification(title: string, message: string) {
  return pushover.send(title, message);
};
