import { checkURL } from "@promise-watch/axios";

export const options = {
  interval: 30,
}

export async function run() {
  await checkURL(new URL("https://jasonraimondi.com"));
}
