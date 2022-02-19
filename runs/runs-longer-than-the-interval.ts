export const options = {
    interval: 1000,
}

export async function run() {
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    console.log("before delay")
    await sleep(8000);
    console.log("end delay")
}