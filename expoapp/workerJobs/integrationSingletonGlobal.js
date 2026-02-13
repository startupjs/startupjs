let runId = 0

export default async function integrationSingletonGlobal (data) {
  runId += 1
  await wait(40)
  return {
    runId,
    data
  }
}

export const singleton = true

function wait (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
