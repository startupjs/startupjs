import { it, describe, afterEach, before } from 'node:test'
import { strict as assert } from 'node:assert'
import { afterEachTestGc, runGc } from './_helpers.js'
import { $, __DEBUG_SIGNALS_CACHE__ as signalsCache } from '../index.js'
import { get as _get } from '../orm/dataTree.js'
import { LOCAL } from '../orm/$.js'
import connect from '../connect/test.js'

before(connect)

export function afterEachTestGcLocal () {
  afterEach(async () => {
    assert.deepEqual(_get([LOCAL]), {}, 'all local data should be GC\'ed')
  })
}

describe('$() function. Values', () => {
  afterEachTestGc()
  afterEachTestGcLocal()

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
    const cacheSize = signalsCache.size
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

describe('$() function. Reactions', () => {
  afterEachTestGc()
  afterEachTestGcLocal()

  it('reaction', async () => {
    const { $firstName, $lastName } = $({ firstName: 'John', lastName: 'Smith' })
    const $fullName = $(() => `${$firstName.get()} ${$lastName.get()}`)
    assert.equal($fullName.get(), 'John Smith')
    $firstName.set('Jane')
    await runGc()
    assert.equal($fullName.get(), 'Jane Smith')
    $firstName.set('Alice')
    assert.equal($fullName.get(), 'Alice Smith')
    await runGc()
    $lastName.set('Brown')
    await runGc()
    assert.equal($fullName.get(), 'Alice Brown')
    $firstName.set('John')
    $lastName.set('Smith')
    await runGc()
    assert.equal($fullName.get(), 'John Smith')
  })
})

describe('set, get, del on local collections', () => {
  afterEachTestGc()
  afterEachTestGcLocal()

  it('set undefined deletes the key in object', () => {
    const $obj = $({ a: 1, b: 2 })
    $obj.a.set(undefined)
    assert.deepEqual($obj.get(), { b: 2 })
  })

  it('set undefined on non-existing key does nothing', () => {
    const $obj = $({ a: 1, b: 2 })
    $obj.c.set(undefined)
    assert.deepEqual($obj.get(), { a: 1, b: 2 })
  })

  it('set undefined sets array\'s element to undefined', () => {
    const $arr = $([1, 2])
    $arr[0].set(undefined)
    assert.deepEqual($arr.get(), [undefined, 2])
  })

  it('set undefined on non-existing array index adds an undefined element', () => {
    const $arr = $([1, 2])
    $arr[3].set(undefined)
    assert.deepEqual($arr.get(), [1, 2, undefined, undefined])
  })

  it('del deletes the key in object', () => {
    const $obj = $({ a: 1, b: 2 })
    $obj.a.del()
    assert.deepEqual($obj.get(), { b: 2 })
  })

  it('del deletes the element in array', () => {
    const $arr = $([1, 2])
    $arr[0].del()
    assert.deepEqual($arr.get(), [2])
  })
})
