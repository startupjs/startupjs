const assert = require('assert')
const model = require('./model')

describe('async', function () {
  let id
  let $category
  let $product
  beforeEach(async function () {
    let category = {
      name: 'Planes'
    }
    let product = {
      name: 'T-50'
    }

    try {
      id = model.id()
      await model.add('categories', { id, ...category })
    } catch (err) {
      assert(!err)
    }

    $category = model.at(`categories.${id}`)
    product.categories = [id]

    try {
      id = model.id()
      await model.add('products', { id, ...product })
    } catch (err) {
      assert(!err)
    }

    $product = model.at(`products.${id}`)

    try {
      await model.fetch($category, $product)
    } catch (err) {
      assert(!err)
    }
  })

  it('should create product', async function () {
    let product = {
      name: 'A-10'
    }
    try {
      await model.add('products', product)
    } catch (err) {
      assert(!err)
    }
  })

  it('should create product with real categoryId', async function () {
    let product = {
      name: 'A-10',
      categoryId: $category.get('id')
    }

    try {
      await model.add('products', product)
    } catch (err) {
      assert(!err)
    }
  })

  it('should not create product with wrong categoryId', async function () {
    let product = {
      name: 'A-10',
      categoryId: model.id()
    }

    try {
      await model.add('products', product)
    } catch (err) {
      assert(err)
    }
  })

  it('should create product with right hash', async function () {
    let product = {
      name: 'A-10',
      categoryHash: {}
    }
    product.categoryHash[$category.get('id')] = 'Some value'

    try {
      await model.add('products', product)
    } catch (err) {
      assert(!err)
    }
  })

  it('should not create product with wrong hash', async function () {
    let product = {
      name: 'A-10',
      categoryHash: {}
    }
    product.categoryHash[model.id()] = 'Some value'

    try {
      await model.add('products', product)
    } catch (err) {
      assert(err)
    }
  })

  it('should create product with right array', async function () {
    let product = {
      name: 'A-10',
      categories: [$category.get('id')]
    }

    try {
      await model.add('products', product)
    } catch (err) {
      assert(!err)
    }
  })

  it('should not create product with wrong array', async function () {
    let product = {
      name: 'A-10',
      categories: [model.id()]
    }

    try {
      await model.add('products', product)
    } catch (err) {
      assert(err)
    }
  })

  it('should set categoryId', async function () {
    try {
      await $product.set('categoryId', $category.get('id'))
    } catch (err) {
      assert(!err)
    }
  })

  it('should not set categoryId', async function () {
    try {
      await $product.set('categoryId', model.id())
    } catch (err) {
      assert(err)
    }
  })

  it('should set array', async function () {
    try {
      await $product.set('categories', [$category.get('id')])
    } catch (err) {
      assert(!err)
    }
  })

  it('should not set array', async function () {
    try {
      await $product.set('categories', [model.id()])
    } catch (err) {
      assert(err)
    }
  })

  it('should push categoryId', async function () {
    try {
      await $product.push('categories', $category.get('id'))
    } catch (err) {
      assert(!err)
    }
  })

  it('should not push categoryId', async function () {
    try {
      await $product.push('categories', model.id())
    } catch (err) {
      assert(err)
    }
  })

  xit('should not insert categoryId', async function () {
    try {
      await $product.insert('categories', 0, model.id())
    } catch (err) {
      assert(err)
    }
  })

  it('should remove categoryId', async function () {
    try {
      await $product.pop('categories')
    } catch (err) {
      assert(!err)
    }
  })

  it('should remove categoryId', async function () {
    try {
      await $product.shift('categories')
    } catch (err) {
      assert(!err)
    }
  })

  it('should move categoryId', async function () {
    try {
      await $product.move('categories', 0, 1)
    } catch (err) {
      assert(!err)
    }
  })

  it('should remove categoryId', async function () {
    try {
      await $product.remove('categories', 0, model.id())
    } catch (err) {
      assert(!err)
    }
  })
})
