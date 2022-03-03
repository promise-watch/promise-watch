export type RunPage<T = void> = {
  name: string;
  options: RunOptions;
  run(): Promise<T>;
};

export type RunPageOptions = {
  interval: number;
  notifiers?: Notifier[];
  logSuccess?: boolean;
  retryImmediatelyAfterFail?: boolean;
};

export type RunOptions = RunPageOptions;

export type PromiseWatchOptions = {
  globPath?: string;
  notifiers: Notifier[];

  /**
   * @deprecated
   * This field is no longer used, T
   * @todo remove in v2.x
   */
  dir?: string;
};

/**
 * @deprecated
 * Use PromiseWatchOptions instead, this will be removed in v2.x
 * @todo remove in v2.x
 */
export type ExecuteOptions = PromiseWatchOptions;

export type SendOptions = {
  title: string;
  body: string;
};

export type Notifier = {
  sendError(options: SendOptions): Promise<void>;
  sendRecovered(options: SendOptions): Promise<void>;
};

export type SendNotifications = { title: string; body: string; notifiers: Notifier[]; isSuccess?: boolean };
