export default async function integrationSleep ({ ms = 100, i }) {
  await wait(ms)
  const result = { ok: true, ms }
  if (i != null) result.i = i
  return result
}

function wait (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
