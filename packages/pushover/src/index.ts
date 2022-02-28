import { Notifier, SendOptions } from "@promise-watch/core";
import { Pushover } from "pushover-js";

export type PushoverOptions = {
  userKey: string;
  apiKey: string;
  url?: string;
  device?: string;
  sound?:
    | "pushover"
    | "bike"
    | "bugle"
    | "cashregister"
    | "classical"
    | "cosmic"
    | "falling"
    | "gamelan"
    | "incoming"
    | "intermission"
    | "magic"
    | "mechanical"
    | "pianobar"
    | "siren"
    | "spacealarm"
    | "tugboat"
    | "alien"
    | "climb"
    | "persistent"
    | "echo"
    | "updown"
    | "vibrate"
    | "none";
  priority?: {
    priority: -2 | -1 | 0 | 1 | 2;
    expire?: number;
    retry?: number;
  };
};

export class PushoverNotifier implements Notifier {
  private readonly pushover: Pushover;

  constructor({ userKey, apiKey, device, sound, priority, url }: PushoverOptions) {
    this.pushover = new Pushover(userKey, apiKey);

    if (device) this.pushover = this.pushover.setDevice(device);
    if (sound) this.pushover = this.pushover.setSound(sound);
    if (url) this.pushover = this.pushover.setUrl(url);
    if (priority) this.pushover = this.pushover.setPriority(priority.priority, priority.expire, priority.retry);
  }

  async sendError({ title, body }: SendOptions) {
    await this.pushover.send(`${title} seems down!`, body);
  }

  async sendRecovered({ title, body }: SendOptions) {
    await this.pushover.send(`${title} has recovered.`, body);
  }
}
