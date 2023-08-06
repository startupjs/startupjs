import { it, describe } from 'node:test'
import { strict as assert } from 'node:assert'
import $, { signal } from '../index.js'
import { __DEBUG_SIGNALS_CACHE__ as signalsCache } from '../src/signal.js'

describe('dot syntax', () => {
  it('navigation', () => {
    $._session.a.b.c.set(1)
    assert.equal($._session.a.b.c.get(), 1)
    assert.equal($._session.a.path(), '_session.a')
    assert.equal($._session.a.b.path(), '_session.a.b')
  })

  it('returns the same instance for the same path', () => {
    assert.equal($, signal())
    assert.equal($._session, $._session)
    assert.notEqual($._session, $._page)
    assert.equal($._session.a.b.c, $._session.a.b.c)
  })

  it('$ aliases', () => {
    assert.equal($._session.a.b.c, $._session.$a.$b.$c)
    $._session.a.b.c.set(1)
    assert.equal($._session.$a.$b.$c.get(), 1)
  })

  it('$ aliases for collections', () => {
    const { $games, $users, games, users } = $
    assert.equal($games.one.name.path(), 'games.one.name')
    assert.equal($users.one.name.path(), 'users.one.name')
    assert.equal($users.one, users.one)
    assert.equal($games.one, games.one)
  })

  it('special handling of $ aliases for private collections _session, _page, $render, etc.', () => {
    const { $session, $page, $render } = $
    assert.equal($session.a.b.c.path(), '_session.a.b.c')
    assert.equal($page.a.b.c.path(), '_page.a.b.c')
    assert.equal($render.a.b.c.path(), '$render.a.b.c')
  })

  it('clears the cache map when the signal is garbage collected', async () => {
    await runGc()
    const cacheSize = signalsCache.size
    await (async () => {
      const { $dummy } = $
      assert.equal(signalsCache.size, cacheSize + 1, '+1: $dummy')
      assert.equal($dummy.path(), 'dummy')
      assert.equal(signalsCache.size, cacheSize + 2, '+2: $dummy, $dummy.path')
      await runGc()
      assert.equal(signalsCache.size, cacheSize + 1, '+1: $dummy.path was cleared since it\'s not in a variable')
      ;(() => $dummy)()
    })()
    await runGc()
    assert.equal(signalsCache.size, cacheSize, 'back to original cache size')
  })
})

describe.skip('iteration', () => {
  it('.map() over collections', () => {
    const { $users, $playerIds, $players } = $.session
    $users.one.name.set('John')
    $users.two.name.set('Jane')
    $users.three.name.set('Jack')
    $playerIds.set(['one', 'two'])
    $players.refList($users.path(), $playerIds.path())
    assert.equal($players.getIds(), ['one', 'two'], '.getIds() gets correct player ids')
  })
})

// for some reason the cache is not cleared if we just call global.gc()
// so we need to wait for the next tick before and after calling it
async function runGc () {
  await new Promise(resolve => setImmediate(resolve))
  global.gc()
  await new Promise(resolve => setImmediate(resolve))
}
