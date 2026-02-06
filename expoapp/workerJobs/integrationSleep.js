export default async function integrationSleep ({ ms = 100 }) {
  await wait(ms)
  return { ok: true, ms }
}

function wait (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
