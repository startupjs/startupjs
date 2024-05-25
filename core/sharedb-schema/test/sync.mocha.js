import assert from 'assert'
import model from './model.js'

let id

describe('sync creation', function () {
  it('should create user', async function () {
    const user = {
      firstName: 'Ivan',
      lastName: 'Ivanov',
      age: 18
    }
    try {
      await model.add('users', user)
    } catch (err) {
      assert(!err)
    }
  })

  it('should not create user', async function () {
    const user = {
      firstName: true,
      lastName: 'Ivanov',
      age: 18
    }
    try {
      await model.add('users', user)
    } catch (err) {
      assert(err)
    }
  })
})

describe('sync editing', function () {
  let $user
  beforeEach(async function () {
    const user = {
      firstName: 'Ivan',
      lastName: 'Ivanov',
      age: 18
    }

    try {
      id = model.id()
      await model.add('users', { id, ...user })
    } catch (err) {
      assert(!err)
    }

    $user = model.at(`users.${id}`)

    try {
      await $user.fetch()
    } catch (err) {
      assert(!err)
    }
  })

  it('should string insert', async function () {
    try {
      await $user.stringInsert('firstName', 2, 'Petr')
    } catch (err) {
      assert(!err)
    }
  })

  it('should not string insert', async function () {
    try {
      await $user.stringInsert('firstName', 2, 'Petr Long Name')
    } catch (err) {
      assert(err)
    }
  })

  it('should string remove', async function () {
    try {
      await $user.stringRemove('firstName', 2, 2)
    } catch (err) {
      assert(!err)
    }
  })

  it('should not string remove', async function () {
    try {
      $user.stringRemove('firstName', 0, 4)
    } catch (err) {
      assert(err)
    }
  })

  it('should set', async function () {
    try {
      $user.set('firstName', 'Petr')
    } catch (err) {
      assert(!err)
    }
  })

  it('should not set because of notVasya', async function () {
    try {
      await $user.set('firstName', 'Vasya')
    } catch (err) {
      assert(err)
    }
  })

  it('should not set becouse of notKey', async function () {
    try {
      await $user.set('firstName', 'firstName')
    } catch (err) {
      assert(err)
    }
  })

  it('should del', async function () {
    try {
      await $user.del('age')
    } catch (err) {
      assert(!err)
    }
  })

  it('should not push not unique item', async function () {
    try {
      await $user.push('hobbies', 'jazz')
    } catch (err) {
      assert(!err)
    }

    try {
      await $user.push('hobbies', 'jazz')
    } catch (err) {
      assert(err)
    }
  })

  it('should not set array with not unique items', async function () {
    try {
      await $user.set('hobbies', ['jazz', 'jazz'])
    } catch (err) {
      assert(err)
    }
  })

  it('should not push array with wrong type items', async function () {
    try {
      await $user.push('hobbies', 4)
    } catch (err) {
      assert(err)
    }
  })

  it('should not push array with wrong validator items', async function () {
    try {
      await $user.push('hobbies', 'Vasya')
    } catch (err) {
      assert(err)
    }
  })

  it('should not set array with wrong validator items', async function () {
    try {
      await $user.set('hobbies', ['Vasya'])
    } catch (err) {
      assert(err)
    }
  })

  it('should increment', async function () {
    try {
      await $user.increment('age', -2)
    } catch (err) {
      assert(!err)
    }
  })

  it('should not increment because of minimum', async function () {
    try {
      await $user.increment('age', -20)
    } catch (err) {
      assert(err)
    }
  })

  it('should delete', async function () {
    try {
      await $user.del()
    } catch (err) {
      assert(!err)
    }
  })
})
