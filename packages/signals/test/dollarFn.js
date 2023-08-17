import { it, describe } from 'node:test'
import { strict as assert } from 'node:assert'
import { $, sub$ } from '../index.js'

describe.skip('$ function', () => {
  it('support partial application with saving signal to identify uniqueness', () => {
    const id = Symbol('unique id')
    $(id)(({ id: _id }) => { assert.equal(_id, id) })
  })

  it('create local model', async () => {
    const $value = $()
    $value.set(42)
    assert.equal($value.get(), 42)
    $value.set('hello')
    assert.equal($value.get(), 'hello')
  })

  it('create local model with initial value', async () => {
    const $number = $(84)
    assert.equal($number.get(), 84)
    const $bool = $(true)
    assert.equal($bool.get(), true)
    const $string = $('hello')
    assert.equal($string.get(), 'hello')
    const $array = $([1, 2, 3])
    assert.deepEqual($array.get(), [1, 2, 3])
    const $object = $({ a: 1, b: 2 })
    assert.deepEqual($object.get(), { a: 1, b: 2 })
  })

  it('create local model with destructuring and test GC', async () => {
    const { $firstName, $lastName } = $()
    $firstName.set('John')
    $lastName.set('Smith')
    runGc()
    // TODO: test that created signal data still exists
    // even though the $() signal itself was garbage collected.
    // Basically don't cleanup created signal data if it's still in use by child signals.
    // This should be possible if we keep the link to the parent signal within each child signals.
    // And when there are no more child signals in use, the GC will clean up the parent signal.
  })

  it('reaction', () => {
    const { $firstName, $lastName } = $({ firstName: 'John', lastName: 'Smith' })
    const $fullName = $(() => `${$firstName.get()} ${$lastName.get()}`)
    assert.equal($fullName.get(), 'John Smith')
    $firstName.set('Jane')
    assert.equal($fullName.get(), 'Jane Smith')
  })

  it('doc', async () => {
    const gameId = '_1'
    const $game = await sub$($.games[gameId])
    assert.equal($game.id.get(), gameId)
  })

  it('doc: deep data also observable after .get()', async () => {
    const gameId = '_2'
    const $game = await sub$($.games[gameId])
    const game = $game.get()
    assert.equal(game.id, gameId)
    // TODO: When returning data from .get(), it should be wrapped into Proxy too
  })

  it('query', async () => {
    const $games = await sub$($.games, { active: true })
    assert.equal($games.get().length, 2)
  })

  it('query should be iterable', async () => {
    const $games = await sub$($.games, { active: true })
    assert.equal([...$games].length, 2)
  })

  it('query should support .map()', async () => {
    const $games = await sub$($.games, { active: true })
    assert.equal($games.map($game => $game.id.get()).sort().join(','), '_1,_2')
  })

  it('async reaction', async () => {
    const $value = await sub$(async () => {
      await new Promise(resolve => setTimeout(resolve, 10))
      return 42
    })
    assert.equal($value.get(), undefined)
    await new Promise(resolve => setTimeout(resolve, 20))
    assert.equal($value.get(), 42)
  })
})

// for some reason the cache is not cleared if we just call global.gc()
// so we need to wait for the next tick before and after calling it
async function runGc () {
  await new Promise(resolve => setImmediate(resolve))
  global.gc()
  await new Promise(resolve => setImmediate(resolve))
}
