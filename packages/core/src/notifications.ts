export type SendOptions = {
  title: string;
  body: string;
}

export type Notifier = {
  send(options: SendOptions): Promise<void>;
}
