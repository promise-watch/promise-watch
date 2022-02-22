export type SendOptions = {
  title: string;
  body: string;
};

export type Notifier = {
  send(options: SendOptions): Promise<void>;
};

export class ConsoleNotifier {
  async send(options: SendOptions) {
    console.log(`${options.title}: ${options.body}`);
  }
}
