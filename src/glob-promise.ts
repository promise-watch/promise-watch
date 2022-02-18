import _glob from "glob";

export function glob(pattern: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    _glob(pattern, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}
