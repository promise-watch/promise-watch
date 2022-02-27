import { sendErrorNotifications } from "./send-notifications";
import { ConsoleNotifier } from "./notifiers/console-notifier";

describe("recursively run", () => {
  const consoleNotifier = new ConsoleNotifier();

  beforeEach(() => {
    consoleNotifier.send = jest.fn(() => Promise.resolve());
    console.log = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("recursion function runs once when halted", async () => {
    const title = "I am the title";
    const body = "The body is a different message";

    await sendErrorNotifications(title, body, [consoleNotifier]);

    expect(consoleNotifier.send).toHaveBeenCalledTimes(1);
    expect(consoleNotifier.send).toHaveBeenCalledWith({ body, title, isSuccess: false });
  });
});
