import { before, beforeEach, afterEach } from 'node:test'
import { strict as assert } from 'node:assert'
import { __DEBUG_SIGNALS_CACHE__ as signalsCache } from '../index.js'

// the cache is not getting cleared if we just call global.gc()
// so we need to wait for the next tick before and after calling it.
//
// Since some signals depend on the parent signals, we need to wait for the next gc cycle
// to make sure that the parent signal is not in use anymore and clear it too.
// Sometimes even more than 2 cycles of GC are required to cleanup everything.
//
// Here is how many GC iterations are required to cleanup different things:
//   - $ signal: 1
//       const $game = $.games[gameId]
//   - $() simple value: 1
//       const $value = $(42)
//   - $() object value with destructuring: 2
//       const { $firstName, $lastName } = $({ firstName: 'John', lastName: 'Smith' })
//   - $() reaction: 4
//       const { $firstName, $lastName } = $({ firstName: 'John', lastName: 'Smith' })
//       const $fullName = $(() => $firstName.get() + ' ' + $lastName.get())
const DELAY = 5
const GC_ITERATIONS = 4
export async function runGc () {
  await delay()
  for (let i = 0; i < GC_ITERATIONS; i++) {
    global.gc()
    await delay()
  }
}

async function delay () {
  await new Promise(resolve => setTimeout(resolve, DELAY))
}

export function afterEachTestGc () {
  let cacheSize

  before(async () => {
    await runGc()
  })

  beforeEach(async () => {
    cacheSize = signalsCache.size
  })

  afterEach(async () => {
    await runGc()
    assert.equal(signalsCache.size, cacheSize, 'signals cache size should be back to original')
  })
}
