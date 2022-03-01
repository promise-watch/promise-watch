export type RunPage = {
  name: string;
  options: RunOptions;
  run(): Promise<void>;
};

export type RunOptions = {
  interval: number;
  notifiers?: Notifier[];
  retryImmediatelyAfterFail?: boolean;
};

export type ExecuteOptions = {
  dir: string;
  globPath?: string;
  notifiers?: Notifier[];
};

export type SendOptions = {
  title: string;
  body: string;
};

export type Notifier = {
  sendError(options: SendOptions): Promise<void>;
  sendRecovered(options: SendOptions): Promise<void>;
};

export type SendNotifications = { title: string; body: string; notifiers: Notifier[]; isSuccess?: boolean };
