import { PushoverNotifier } from "./index";

describe("recursively run", () => {
  const notifier = new PushoverNotifier({
    apiKey: "testing",
    userKey: "testing",
  });

  beforeEach(() => {
    notifier.send = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("recursion function runs once when halted", async () => {
    await notifier.send({
      title: "title",
      body: "body",
    });
    expect(notifier.send).toHaveBeenCalledTimes(1);
  });
});
