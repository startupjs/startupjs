import { it, describe, before, beforeEach, afterEach } from 'node:test'
import { strict as assert } from 'node:assert'
import { runGc } from './_helpers.js'
import { $, sub$, __DEBUG_SIGNALS_CACHE__ as signalsCache } from '../index.js'
import { get as _get } from '../orm/dataTree.js'
import { LOCAL } from '../orm/$.js'

describe('$() function. Values', () => {
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
    assert.deepEqual(_get([LOCAL]), {}, 'all local data should be GC\'ed')
  })

  it('create local model. Test that data gets deleted after the signal is GC\'ed', async () => {
    assert.equal(_get([LOCAL]), undefined, 'initially local model is undefined')
    const $value = $()
    $value.set(42)
    assert.equal($value.get(), 42)
    $value.set('hello')
    assert.equal($value.get(), 'hello')
    assert.deepEqual(_get([LOCAL]), { _0: 'hello' })
    await runGc()
    assert.equal($value.get(), 'hello')
  })

  it('create local model with initial value', async () => {
    const $number = $(84)
    assert.equal($number.get(), 84)
    const $bool = $(true)
    assert.equal($bool.get(), true)
    const $string = $('hello')
    assert.equal($string.get(), 'hello')
    const array = [1, 2, 3]
    const $array = $(array)
    assert.equal($array.get(), array)
    assert.deepEqual($array.get(), [1, 2, 3])
    const object = { a: 1, b: 2 }
    const $object = $(object)
    assert.equal($object.get(), object)
    assert.deepEqual($object.get(), { a: 1, b: 2 })
  })

  it('create local model with destructuring', async () => {
    const { $firstName, $lastName } = $({ firstName: 'John', lastName: 'Smith' })
    assert.equal($firstName.get(), 'John')
    assert.equal($lastName.get(), 'Smith')
  })

  it('create local model with destructuring and check the parent object', async () => {
    const $user = $()
    const { $firstName, $lastName } = $user
    $firstName.set('John')
    $lastName.set('Smith')
    assert.equal($firstName.get(), 'John')
    assert.equal($lastName.get(), 'Smith')
    assert.deepEqual($user.get(), { firstName: 'John', lastName: 'Smith' })
  })

  it('test gc. Create using destructuring', async () => {
    const $user = $({ firstName: 'John', lastName: 'Smith' })
    assert.equal(signalsCache.size, cacheSize + 1, '+1: $user')
    const { $firstName, $lastName } = $user
    assert.equal(signalsCache.size, cacheSize + 3, '+3: $user, $firstName, $lastName')
    assert.equal($firstName.get(), 'John')
    assert.equal(signalsCache.size, cacheSize + 4, '+4: $user, $firstName, $lastName, $firstName.get')
    await runGc()
    assert.equal(signalsCache.size, cacheSize + 3, '+3: $firstName.get was cleared since it\'s not in a variable')
    assert.equal($firstName.get(), 'John')
    assert.equal($lastName.get(), 'Smith')
    assert.deepEqual($user.get(), { firstName: 'John', lastName: 'Smith' })
  })

  it('child signals hold a strong ref to the $() signal and after GC is run children data still exists', async () => {
    const { $firstName, $lastName } = $()
    $firstName.set('John')
    $lastName.set('Smith')
    assert.equal($firstName.get(), 'John', 'firstName should be John')
    assert.equal($lastName.get(), 'Smith', 'lastName should be Smith')
    await runGc()
    assert.equal($firstName.get(), 'John', 'firstName should still be John after GC')
    assert.equal($lastName.get(), 'Smith', 'lastName should still be Smith after GC')
  })
})

describe.skip('persistance of $() function across component re-renders', () => {
  it('support partial application with saving signal to identify uniqueness', () => {
    const id = Symbol('unique id')
    $(id)(({ id: _id }) => { assert.equal(_id, id) })
  })
})

describe.skip('$() function. Reactions', () => {
  it('reaction', () => {
    const { $firstName, $lastName } = $({ firstName: 'John', lastName: 'Smith' })
    const $fullName = $(() => `${$firstName.get()} ${$lastName.get()}`)
    assert.equal($fullName.get(), 'John Smith')
    $firstName.set('Jane')
    assert.equal($fullName.get(), 'Jane Smith')
  })
})

describe.skip('$sub() function', () => {
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
