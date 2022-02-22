import { Notifier, SendOptions } from "@promise-watch/core";
import { Pushover } from "pushover-js";

export class PushoverNotifier implements Notifier {
  private readonly pushover: Pushover;

  constructor(userKey: string, apiKey: string) {
    this.pushover = new Pushover(userKey, apiKey);
  }

  async send({ title, body }: SendOptions): Promise<void> {
    await this.pushover.send(title, body);
  }
}
