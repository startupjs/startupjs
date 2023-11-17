import assert from 'assert'
import model from './model.js'

let id

describe('errors', function () {
  it('should return firstName error', async function () {
    const user = {
      firstName: true,
      lastName: 'Ivanov',
      age: 18
    }

    try {
      await model.add('users', user)
    } catch (err) {
      const [errorData] = JSON.parse(err.message, null, 2)

      assert.strictEqual(errorData.code, 'INVALID_TYPE')
      assert.strictEqual(errorData.collection, 'users')
      assert.strictEqual(errorData.relativePath, 'firstName')
    }
    assert(true)
  })

  it('should return hobbies.1 error', async function () {
    const user = {
      firstName: 'Ivan',
      lastName: 'Ivanov',
      age: 18,
      hobbies: ['jazz', 4]
    }

    try {
      await model.add('users', user)
    } catch (err) {
      const [errorData] = JSON.parse(err.message, null, 2)

      assert.strictEqual(errorData.code, 'INVALID_TYPE')
      assert.strictEqual(errorData.collection, 'users')
      assert.strictEqual(errorData.relativePath, 'hobbies.1')
    }
    assert(true)
  })

  it('should return hobbies.2 error', async function () {
    const user = {
      firstName: 'Ivan',
      lastName: 'Ivanov',
      age: 18,
      hobbies: ['jazz', 'r`n`r', 'Vasya']
    }

    try {
      await model.add('users', user)
    } catch (err) {
      assert.strictEqual(err.message, 'Can not be Vasya')
    }
    assert(true)
  })

  it('should return categoryHash error', async function () {
    const product = {
      categoryHash: {
        wrong: 'asdf'
      }
    }

    try {
      await model.add('products', product)
    } catch (err) {
      assert.strictEqual(err.message, 'No categories with id wrong')
    }
    assert(true)
  })

  it('should return wrong error', async function () {
    const product = {
      name: 'B-737'
    }

    try {
      id = model.id()
      await model.add('products', { id, ...product })
    } catch (err) {
      assert(!err)
    }

    const $product = model.at(`products.${id}`)

    try {
      await $product.fetch()
    } catch (err) {
      assert(!err)
    }

    try {
      $product.set('wrong', { value: 23 })
    } catch (err) {
      const [errorData] = JSON.parse(err.message, null, 2)

      assert.strictEqual(errorData.code, 'OBJECT_ADDITIONAL_PROPERTIES')
      assert.strictEqual(errorData.collection, 'products')
      assert.strictEqual(errorData.relativePath, 'wrong')
    }
    assert(true)
  })

  it('should return categories.0 error', async function () {
    const product = {
      name: 'B-2'
    }

    try {
      id = model.id()
      await model.add('products', { id, ...product })
    } catch (err) {
      assert(!err)
    }

    const $product = model.at(`products.${id}`)

    try {
      await $product.fetch()
    } catch (err) {
      assert(!err)
    }

    try {
      id = model.id()
      await $product.push('categories', id)
    } catch (err) {
      assert.strictEqual(err.message, `No categories with id ${id}`)
    }
    assert(true)
  })

  it('should return values.value.0 error', async function () {
    const product = {
      name: 'B-2'
    }

    try {
      id = model.id()
      await model.add('products', { id, ...product })
    } catch (err) {
      assert(!err)
    }

    const $product = model.at(`products.${id}`)

    try {
      await $product.fetch()
    } catch (err) {
      assert(!err)
    }

    try {
      $product.set('values.value', ['wrong'])
    } catch (err) {
      const errorData = JSON.parse(err.message, null, 2)

      assert.strictEqual(errorData.code, 'INVALID_TYPE')

      assert.strictEqual(errorData.collection, 'products')
      assert.strictEqual(errorData.path, `products.${id}.values.value.0`)
    }
    assert(true)
  })
})
