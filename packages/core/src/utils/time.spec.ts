import { howLongAgo } from "./time";

it("converts millisecond timestamps to a human formatted string", () => {
  expect(howLongAgo(Date.now() - 1000)).toBe("1 second");
  expect(howLongAgo(Date.now() - 19 * 1000)).toBe("19 seconds");
  expect(howLongAgo(Date.now() - 75 * 1000)).toBe("1 minute 15 seconds");
  expect(howLongAgo(Date.now() - 153 * 1000)).toBe("2 minutes 33 seconds");
  expect(howLongAgo(Date.now() - 60 * 42.2 * 1000)).toBe("42 minutes 12 seconds");
});
