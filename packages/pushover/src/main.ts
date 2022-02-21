import { Notifier, SendOptions } from "@js-watcher/core";
import { Pushover } from "pushover-js";

export class PushoverNotifier implements Notifier {
  private readonly pushover: Pushover;

  constructor(userKey: string, apiKey: string) {
    this.pushover = new Pushover(userKey, apiKey);
  }

  async send({ title, body }: SendOptions): Promise<void> {
    console.log(title, body);

    if (process.env.NODE_ENV === "production") {
      await this.pushover.send(title, body)
    }
  }
}
