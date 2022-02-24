function numberEnding(number: number) {
  return (number > 1) ? "s" : "";
}

export function millisecondsToStr(milliseconds: number) {
  const seconds = Math.floor((Date.now() - milliseconds) / 1000);

  if (seconds) {
    return seconds + " second" + numberEnding(seconds);
  }

  return "less than a second";
}