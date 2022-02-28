import axios, { AxiosResponse } from "axios";

export async function checkURL(url: URL): Promise<AxiosResponse> {
  return axios.get(url.toString())
    .catch((error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new Error(`Failed with response code [${error.response.status}].`);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        throw new Error(`The request was made but no response was received.`);
      }
      throw error;
    });
}
