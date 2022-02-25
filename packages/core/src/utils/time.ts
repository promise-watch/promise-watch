export function howLongAgo(milliseconds: number) {
  const numberEnding = (n: number) => (n > 1) ? "s" : "";

  const seconds = Math.floor((Date.now() - milliseconds) / 1000);

  if (seconds > 60) {
    const minutes = Math.floor(seconds / 60)
    const secondsLeft = Math.floor(seconds % 60)
    return minutes + " minute" + numberEnding(minutes) + " " + secondsLeft + " second" + numberEnding(secondsLeft);
  }

  if (seconds) {
    return seconds + " second" + numberEnding(seconds);
  }

  return "less than a second";
}
