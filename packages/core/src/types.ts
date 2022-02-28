export type RunPage = {
  name: string;
  options: RunOptions;
  run(): Promise<void>;
};

export type RunOptions = {
  interval: number;
  notifiers?: Notifier[];
  tryAgainImmediately?: boolean;
};

export type ExecuteOptions = {
  dir: string;
  globPath?: string;
  notifiers?: Notifier[];
};

export type SendOptions = {
  title: string;
  body: string;
  isSuccess?: boolean;
};

export type Notifier = {
  send(options: SendOptions): Promise<void>;
};

export type SendNotifications = { title: string; body: string; notifiers: Notifier[]; isSuccess?: boolean };
