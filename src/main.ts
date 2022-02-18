import { run } from "../runs/check-website";
import { interval } from "rxjs";

void (async function () {
  const timer = interval(10000);

  timer.subscribe(async () => {
    try {
      await run();
    } catch (e) {
      console.error(e);
    }
  });
}());
