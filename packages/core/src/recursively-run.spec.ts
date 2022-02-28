import { haltRecursion, recursivelyRun } from "./recursively-run";
import { ConsoleNotifier } from "./notifiers/console-notifier";
import { RunPage } from "./types";

describe("recursively run", () => {
  const page: RunPage = {
    name: "test run",
    run: async () => {
      throw new Error("invalid run");
    },
    options: { interval: 1 },
  };

  beforeEach(() => {
    console.log = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("recursion function runs once when halted", async () => {
    haltRecursion();
    await recursivelyRun(page, [new ConsoleNotifier()]);
    expect(page.run).toHaveBeenCalledTimes(1);
  });
});
