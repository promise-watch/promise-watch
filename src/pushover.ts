import { Pushover } from "pushover-js";

const pushover = new Pushover(process.env.PUSHOVER_USER_KEY!, process.env.PUSHOVER_API_KEY!);

export async function sendNotification(title: string, message: string) {
  try {
    const response = await pushover.send(title, message);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};