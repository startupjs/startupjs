import { it, describe, before } from 'node:test'
import { strict as assert } from 'node:assert'
import { runGc } from './_helpers.js'
import { $, signal, __DEBUG_SIGNALS_CACHE__ as signalsCache, GLOBAL_ROOT_ID } from '../index.js'
import connect from '../connect/test.js'

before(connect)

describe('dot syntax', () => {
  it('navigation and set/get into _session', () => {
    $._session.a.b.c.set(1)
    assert.equal($._session.a.b.c.get(), 1)
    assert.equal($._session.a.path(), '_session.a')
    assert.equal($._session.a.b.path(), '_session.a.b')
  })

  it('returns the same instance for the same path', () => {
    assert.equal($, signal(undefined, [], { rootId: GLOBAL_ROOT_ID }))
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
