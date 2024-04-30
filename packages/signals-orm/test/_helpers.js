// the cache is not getting cleared if we just call global.gc()
// so we need to wait for the next tick before and after calling it.
// Also since some signals depend on the parent signals, we need to wait for the next gc cycle
// to make sure that the parent signal is not in use anymore and clear it too.
const DELAY = 10
export async function runGc () {
  await delay()
  global.gc()
  await delay()
  global.gc()
  await delay()
}

async function delay () {
  await new Promise(resolve => setTimeout(resolve, DELAY))
}
