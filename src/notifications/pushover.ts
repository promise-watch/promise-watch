import { Pushover } from "pushover-js";

const pushover = new Pushover(
  process.env.PUSHOVER_USER_KEY!,
  process.env.PUSHOVER_API_KEY!,
);

export async function sendNotification(title: string, message: string) {
  console.error(title, message);

  if (process.env.NODE_ENV === "production") {
    return pushover.send(title, message);
  }

  return;
}
