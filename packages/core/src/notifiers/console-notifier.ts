import { SendOptions } from "../types";

export class ConsoleNotifier {
  async send(options: SendOptions) {
    console.log(`${options.title}: ${options.body}`);
  }
}
