import { Notifier, SendOptions } from "../types";

export class ConsoleNotifier implements Notifier{
  async sendError(options: SendOptions): Promise<void> {
    console.error(options.title, options.body);
  }

  async sendRecovered(options: SendOptions): Promise<void> {
    console.log(options.title, options.body);
  }
}
