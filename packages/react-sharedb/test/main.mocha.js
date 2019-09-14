import { asyncImport, cleanup } from './_globals'
import React from 'react'
import { expect } from 'chai'
import { alias } from './util'
import _ from 'lodash'
import './_server'
import waitForExpect from 'wait-for-expect'
import {
  initSimple as initSimpleOrig,
  initComplex,
  tInitHooksSimple,
  tInitHooksComplex,
  convertToHooksSubscribeParams,
  unmount
} from './_helpers'

const HOOKS = process.env.HOOKS
const DEPRECATED = process.env.DEPRECATED
const PREFIX = HOOKS
  ? 'Hooks. '
  : DEPRECATED ? 'Class [DEPRECATED]. ' : 'Class. '

// Maybe change initSimple to Hooks-specific version
const initSimple = HOOKS
  ? async (initialProps, subscribeFn, params) => {
    if (typeof initialProps === 'function') {
      params = subscribeFn
      subscribeFn = initialProps
      initialProps = {}
    }
    let { initWithData } = params || {}
    let w = await tInitHooksSimple(
      initialProps,
      convertToHooksSubscribeParams(subscribeFn)
    )
    await w.nextRender(initWithData ? { index: 0 } : { index: 1 })
    return w
  }
  : initSimpleOrig

// Workaround to init rpc and subscribe only after the server started (which is a global before)
before(asyncImport)

// Unmount component after each test
afterEach(cleanup)

describe(PREFIX + 'Helpers', () => {
  it('test RPC', async () => {
    let w
    await serverModel.setAsync(`users.${alias(1)}.name`, alias(1))
    w = await initSimple(() => ({ items: subDoc('users', alias(1)) }))
    expect(w.items).to.include(alias(1))
    unmount()

    await serverModel.setAsync(`users.${alias(1)}.name`, 'Abrakadabra')
    w = await initSimple(() => ({ items: subDoc('users', alias(1)) }))
    expect(w.items).to.include('Abrakadabra')
    unmount()

    await serverModel.setAsync(`users.${alias(1)}.name`, alias(1))
    w = await initSimple(() => ({ items: subDoc('users', alias(1)) }))
    expect(w.items).to.include(alias(1))
  })
})

describe(PREFIX + 'Docs', () => {
  it('doc by id', async () => {
    let w = await initSimple(() => ({ items: subDoc('users', alias(3)) }))
    expect(w.items)
      .to.have.lengthOf(1)
      .and.include(alias(3))
  })

  it('dynamic data update', async () => {
    let w = await initSimple(() => ({ items: subDoc('users', alias(1)) }))
    expect(w.items)
      .to.have.lengthOf(1)
      .and.include(alias(1))
    let updateAndCheckName = async newName => {
      serverModel.set(`users.${alias(1)}.name`, newName)
      await w.nextRender()
      expect(w.items)
        .to.have.lengthOf(1)
        .and.include(newName)
    }
    for (let i in _.range(50)) {
      await updateAndCheckName(`TestUpdate${i}_`)
    }
    await updateAndCheckName(alias(1))
  })
})

describe(PREFIX + 'Queries', () => {
  it('all collection', async () => {
    let w = await initSimple(() => ({ items: subQuery('users', {}) }))
    expect(w.items)
      .to.have.lengthOf(5)
      .and.include.members(alias([1, 2, 3, 4, 5]))
  })

  it('parametrized 1', async () => {
    let w = await initSimple(() => ({
      items: subQuery('users', { color: 'blue' })
    }))
    expect(w.items)
      .to.have.lengthOf(2)
      .and.include.members(alias([1, 2]))
  })

  it('parametrized 2', async () => {
    let w = await initSimple(() => ({
      items: subQuery('users', { color: 'red' })
    }))
    expect(w.items)
      .to.have.lengthOf(3)
      .and.include.members(alias([3, 4, 5]))
  })

  it('dynamic data update', async () => {
    let w = await initSimple(() => ({
      items: subQuery('users', { color: 'red' })
    }))
    expect(w.items)
      .to.have.lengthOf(3)
      .and.include.members(alias([3, 4, 5]))
    let updateAndCheckItems = async (index, color, indexes, decrease) => {
      serverModel.set(`users.${alias(index)}.color`, color)
      // Wait for 2 renders when the item is going to disappear from
      // the query results.
      // NOTE: 2 renderings are happening because when
      // the data is changed in the item which is already loaded to
      // the client-side model, it is not getting removed from
      // the query result immediately since the doc ids are updated
      // by query only from the server-side.
      // So for some time the document which doesn't match the query
      // anymore, will still be present in the array.
      let renders = decrease ? 2 : 1
      await w.nextRender(renders)
      expect(w.items)
        .to.have.lengthOf(indexes.length)
        .and.include.members(alias(indexes))
    }
    await updateAndCheckItems(3, 'blue', [4, 5])
    await updateAndCheckItems(4, 'blue', [5])
    await updateAndCheckItems(1, 'red', [1, 5])
    await updateAndCheckItems(3, 'red', [1, 3, 5])
    await updateAndCheckItems(5, 'blue', [1, 3])
    await updateAndCheckItems(1, 'blue', [3])
    await updateAndCheckItems(3, 'blue', [])
    await updateAndCheckItems(5, 'red', [5])
    await updateAndCheckItems(3, 'red', [3, 5])
    await updateAndCheckItems(4, 'red', [3, 4, 5])
  })

  it('dynamic update of query param', async () => {
    let w = await initSimple({ color: 'red' }, ({ color }) => ({
      items: subQuery('users', { color })
    }))
    expect(w.items)
      .to.have.lengthOf(3)
      .and.include.members(alias([3, 4, 5]))
    for (let i = 0; i < 20; i++) {
      w.setProps({ color: 'blue' })
      await w.nextRender()
      expect(w.items)
        .to.have.lengthOf(2)
        .and.include.members(alias([1, 2]))
      w.setProps({ color: 'red' })
      await w.nextRender()
      expect(w.items)
        .to.have.lengthOf(3)
        .and.include.members(alias([3, 4, 5]))
    }
  })
})

describe(PREFIX + 'Local', () => {
  it('should synchronously get local data with the first render', async () => {
    model.set('_page.document', { id: alias(1), name: alias(1) })
    let w = await initSimple(() => ({ items: subLocal('_page.document') }), {
      initWithData: true
    })
    expect(w.items)
      .to.have.lengthOf(1)
      .and.include(alias(1))
    model.del('_page.document')
    await w.nextRender({ index: 1 })
    expect(w.items).to.have.lengthOf(0)
  })

  it('when starts from empty data, should update data as soon as it appears', async () => {
    let w = await initSimple(() => ({ items: subLocal('_page.document') }), {
      initWithData: true
    })
    expect(w.items).to.have.lengthOf(0)
    model.set('_page.document', { id: alias(1), name: alias(1) })
    await w.nextRender({ index: 1 })
    expect(w.items)
      .to.have.lengthOf(1)
      .and.include(alias(1))
    model.del('_page.document')
    await w.nextRender({ index: 2 })
    expect(w.items).to.have.lengthOf(0)
  })

  it('should update data', async () => {
    let w = await initSimple(() => ({ items: subLocal('_page.document') }), {
      initWithData: true
    })
    expect(w.items).to.have.lengthOf(0)

    model.set('_page.document', { id: alias(1), name: alias(1) })
    await w.nextRender({ index: 1 })
    expect(w.items)
      .to.have.lengthOf(1)
      .and.include(alias(1))

    model.set('_page.document', { id: alias(2), name: alias(2) })
    await w.nextRender({ index: 2 })
    expect(w.items)
      .to.have.lengthOf(1)
      .and.include(alias(2))

    model.del('_page.document')
    await w.nextRender({ index: 3 })
    expect(w.items).to.have.lengthOf(0)

    model.set('_page.document', { id: alias(3), name: alias(3) })
    await w.nextRender({ index: 4 })
    expect(w.items)
      .to.have.lengthOf(1)
      .and.include(alias(3))

    model.set('_page.document.name', alias(4))
    await w.nextRender({ index: 5 })
    expect(w.items)
      .to.have.lengthOf(1)
      .and.include(alias(4))

    model.del('_page.document')
    await w.nextRender({ index: 6 })
    expect(w.items).to.have.lengthOf(0)
  })

  it('should sync get data and then update it', async () => {
    model.set('_page.document', { id: alias(1), name: alias(1) })

    let w = await initSimple(() => ({ items: subLocal('_page.document') }), {
      initWithData: true
    })
    expect(w.items)
      .to.have.lengthOf(1)
      .and.include(alias(1))

    model.set('_page.document', { id: alias(2), name: alias(2) })
    await w.nextRender({ index: 1 })
    expect(w.items)
      .to.have.lengthOf(1)
      .and.include(alias(2))

    model.del('_page.document')
    await w.nextRender({ index: 2 })
    expect(w.items).to.have.lengthOf(0)

    model.set('_page.document', { id: alias(3), name: alias(3) })
    await w.nextRender({ index: 3 })
    expect(w.items)
      .to.have.lengthOf(1)
      .and.include(alias(3))

    model.set('_page.document.name', alias(4))
    await w.nextRender({ index: 4 })
    expect(w.items)
      .to.have.lengthOf(1)
      .and.include(alias(4))

    model.del('_page.document')
    await w.nextRender({ index: 5 })
    expect(w.items).to.have.lengthOf(0)
  })
})

if (!DEPRECATED) {
  describe(PREFIX + 'Value', () => {
    const getLocalPath = () => {
      if (HOOKS) {
        let docId = Object.keys(model.get('$hooks')).find(i => i !== '__FOO')
        return `$hooks.${docId}`
      } else {
        let docId = Object.keys(model.get('$components')).find(
          i => i !== '__FOO'
        )
        return `$components.${docId}.items`
      }
    }

    it('update value', async () => {
      let w = await initSimple(
        () => ({ items: subValue({ id: alias(1), name: alias(1) }) }),
        { initWithData: true }
      )
      expect(w.items)
        .to.have.lengthOf(1)
        .and.include(alias(1))

      let localPath = getLocalPath()
      model.set(localPath, { id: alias(2), name: alias(2) })
      await w.nextRender({ index: 1 })
      expect(w.items)
        .to.have.lengthOf(1)
        .and.include(alias(2))

      model.del(localPath)
      await w.nextRender({ index: 2 })
      expect(w.items).to.have.lengthOf(0)

      model.set(localPath, { id: alias(3), name: alias(3) })
      await w.nextRender({ index: 3 })
      expect(w.items)
        .to.have.lengthOf(1)
        .and.include(alias(3))

      model.set(`${localPath}.name`, alias(4))
      await w.nextRender({ index: 4 })
      expect(w.items)
        .to.have.lengthOf(1)
        .and.include(alias(4))

      model.del(localPath)
      await w.nextRender({ index: 5 })
      expect(w.items).to.have.lengthOf(0)
    })
  })

  describe(PREFIX + 'Api', () => {
    it('should get data from the api', async () => {
      let w = await initSimple(() => ({
        items: subApi(
          '_page.document',
          index =>
            new Promise(
              resolve =>
                setTimeout(() => {
                  resolve({ id: alias(index), name: alias(index) })
                }),
              500
            ),
          [1]
        )
      }))
      let count = HOOKS ? 1 : 0
      await w.nextRender({ index: count++ })
      expect(w.items)
        .to.have.lengthOf(1)
        .and.include(alias(1))
      model.setDiff('_page.document.name', alias(2))
      await w.nextRender({ index: count++ })
      expect(w.items)
        .to.have.lengthOf(1)
        .and.include(alias(2))
    })

    // TODO: Enzyme unmount doesn't trigger destruction for some reason.
    //       For now run this test only for hooks since they
    //       use react-test-renderer
    if (HOOKS) {
      it('should remove local path after destroy', async () => {
        await new Promise(resolve => setTimeout(resolve, 500))
        expect(model.get('_page.document')).to.be.an('undefined')
      })
    } else {
      it('[cleanup] force clear _page.document from prev test', () => {
        model.del('_page.document')
      })
    }
  })
}

describe(PREFIX + 'Edge cases', () => {
  it('initially null document. Then update to create it.', async () => {
    let userId = alias(777)
    let w = await initSimple(() => ({ items: subDoc('users', userId) }))
    expect(w.items).to.have.lengthOf(0)
    serverModel.add(`users`, {
      id: userId,
      name: userId
    })
    await w.nextRender()
    expect(w.items)
      .to.have.lengthOf(1)
      .and.include(userId)
    serverModel.set(`users.${userId}.name`, 'Abrakadabra')
    await w.nextRender()
    expect(w.items)
      .to.have.lengthOf(1)
      .and.include('Abrakadabra')
    serverModel.set(`users.${userId}.name`, 'Blablabla')
    await w.nextRender()
    expect(w.items)
      .to.have.lengthOf(1)
      .and.include('Blablabla')
    serverModel.del(`users.${userId}`)
    await w.nextRender()
    expect(w.items).to.have.lengthOf(0)
    serverModel.add(`users`, {
      id: userId,
      name: userId
    })
    await w.nextRender()
    expect(w.items)
      .to.have.lengthOf(1)
      .and.include(userId)
    serverModel.set(`users.${userId}.name`, 'Abrakadabra')
    await w.nextRender()
    expect(w.items)
      .to.have.lengthOf(1)
      .and.include('Abrakadabra')
    serverModel.del(`users.${userId}`)
    await w.nextRender()
  })

  it('ref NON existent local document and ensure reactivity', async () => {
    let w = await initSimple(() => ({ items: subLocal('_page.document') }), {
      initWithData: true
    })
    expect(w.items).to.have.lengthOf(0)
    await w.nextRender(() => {
      model.set('_page.document', { id: 'document', name: 'document' })
    })
    expect(w.items)
      .to.have.lengthOf(1)
      .and.include('document')
    await w.nextRender(() => model.set('_page.document.name', 'first'))
    // await new Promise(resolve => setTimeout(resolve, 1000))
    // await w.nextRender(3, () => {})
    expect(w.items)
      .to.have.lengthOf(1)
      .and.include('first')
    await w.nextRender(() => model.set('_page.document.name', 'second'))
    expect(w.items)
      .to.have.lengthOf(1)
      .and.include('second')
    model.del('_page.document')
    // await w.nextRender(3, () => {})
  })

  it('ref an existing local document and ensure reactivity', async () => {
    model.set('_page.document', { id: 'document', name: 'document' })
    let w = await initSimple(() => ({ items: subLocal('_page.document') }), {
      initWithData: true
    })
    expect(w.items)
      .to.have.lengthOf(1)
      .and.include('document')
    await w.nextRender(() => model.set('_page.document.name', 'first'))
    expect(w.items)
      .to.have.lengthOf(1)
      .and.include('first')
    await w.nextRender(() => model.set('_page.document.name', 'second'))
    expect(w.items)
      .to.have.lengthOf(1)
      .and.include('second')
    model.del('_page.document')
  })

  it('should render only when changing something which was rendered before', async () => {
    model.set('_page.document', { id: 'document', name: 'document' })
    let w = await initSimple(() => ({ items: subLocal('_page.document') }), {
      initWithData: true
    })
    expect(w.items)
      .to.have.lengthOf(1)
      .and.include('document')
    await w.nextRender(() => {
      model.set('_page.document.name', 'first')
    })
    expect(w.items)
      .to.have.lengthOf(1)
      .and.include('first')
    await w.nextRender(() => {
      model.set('_page.document.color', 'red')
      model.set('_page.document.name', 'second')
    })
    expect(w.items)
      .to.have.lengthOf(1)
      .and.include('second')
    await w.nextRender(() => {
      model.set('_page.document.color', 'green')
      model.set('_page.document.name', 'third')
    })
    expect(w.items)
      .to.have.lengthOf(1)
      .and.include('third')
    await w.nextRender(() => {
      model.set('_page.document.showColor', true)
    })
    expect(w.items)
      .to.have.lengthOf(1)
      .and.include('third')
    await w.nextRender(() => {
      model.set('_page.document.color', 'yellow')
    })
    expect(w.items)
      .to.have.lengthOf(1)
      .and.include('third')
    await w.nextRender(2, () => {
      model.set('_page.document.color', 'orange')
      model.set('_page.document.name', 'fourth')
    })
    expect(w.items)
      .to.have.lengthOf(1)
      .and.include('fourth')
    await w.nextRender(() => {
      model.del('_page.document.showColor')
    })
    expect(w.items)
      .to.have.lengthOf(1)
      .and.include('fourth')
    await w.nextRender(2, () => {
      model.set('_page.document.color', 'grey')
      model.set('_page.document.name', 'fifth')
      model.set('_page.document.color', 'black')
      model.set('_page.document.name', 'sixth')
    })
    expect(w.items)
      .to.have.lengthOf(1)
      .and.include('sixth')
    model.del('_page.document')
  })

  it('model.setEach() should batch changes and only render once', async () => {
    model.set('_page.document', {
      id: 'document',
      name: 'document',
      showColor: true
    })
    let w = await initSimple(() => ({ items: subLocal('_page.document') }), {
      initWithData: true
    })
    expect(w.items)
      .to.have.lengthOf(1)
      .and.include('document')
    await w.nextRender(() => {
      model.set('_page.document.color', 'grey')
    })
    expect(w.items)
      .to.have.lengthOf(1)
      .and.include('document')
    await w.nextRender(3, () => {
      model.setEach('_page.document', { color: 'green', name: 'first' })
      model.setEach('_page.document', { color: 'black', name: 'second' })
      model.setEach('_page.document', { color: 'yellow', name: 'third' })
    })
    expect(w.items)
      .to.have.lengthOf(1)
      .and.include('third')
    model.del('_page.document')
  })
})

// NON-hooks only

if (!HOOKS) {
  describe(PREFIX + 'Complex', () => {
    it('multiple subscriptions. Query and Doc. Removal of keys.', async () => {
      let w = await initComplex(
        {
          color0: 'red',
          color1: 'blue'
        },
        ({ color0, color1, hasCar }) => {
          let res = {
            items0: color0 && subQuery('users', { color: color0 }),
            items1: color1 && subQuery('users', { color: color1 })
          }
          if (hasCar) res.items2 = subDoc('cars', 'test1_')
          return res
        }
      )
      expect(w.items[0])
        .to.have.lengthOf(3)
        .and.include.members(alias([3, 4, 5]))
      expect(w.items[1])
        .to.have.lengthOf(2)
        .and.include.members(alias([1, 2]))
      expect(w.items[2]).to.have.lengthOf(0)
      // 4 renders should happen: for props change and each item's setState

      await w.setProps({
        color0: 'blue',
        color1: 'red',
        hasCar: true
      })

      await waitForExpect(() => {
        expect(w.items[0])
          .to.have.lengthOf(2)
          .and.include.members(alias([1, 2]))
        expect(w.items[1])
          .to.have.lengthOf(3)
          .and.include.members(alias([3, 4, 5]))
        expect(w.items[2])
          .to.have.lengthOf(1)
          .and.include.members(alias([1]))
      })

      // 1 render should happen: for props and removeItemData -- sync
      await w.setProps({ hasCar: false })
      await waitForExpect(() => {
        expect(w.items[0])
          .to.have.lengthOf(2)
          .and.include.members(alias([1, 2]))
        expect(w.items[1])
          .to.have.lengthOf(3)
          .and.include.members(alias([3, 4, 5]))
        expect(w.items[2]).to.have.lengthOf(0)
      })
      await w.setProps({
        color0: undefined,
        color1: { $in: ['red', 'blue'] },
        hasCar: true
      })
      await waitForExpect(() => {
        expect(w.items[0]).to.have.lengthOf(0)
        expect(w.items[1])
          .to.have.lengthOf(5)
          .and.include.members(alias([1, 2, 3, 4, 5]))
        expect(w.items[2])
          .to.have.lengthOf(1)
          .and.include.members(alias([1]))
      })
      await w.setProps({
        color0: 'red',
        hasCar: false
      })
      await waitForExpect(() => {
        expect(w.items[0])
          .to.have.lengthOf(3)
          .and.include.members(alias([3, 4, 5]))
        expect(w.items[1])
          .to.have.lengthOf(5)
          .and.include.members(alias([1, 2, 3, 4, 5]))
        expect(w.items[2]).to.have.lengthOf(0)
      })
    })
  })
}

// Hooks only

if (HOOKS) {
  describe(PREFIX + 'Complex', () => {
    it('basic', async () => {
      let items = [
        'user',
        'game1',
        'game2',
        'players1',
        'players2',
        'usersInGame1',
        'usersInGame2'
      ]
      let w = await tInitHooksComplex()
      await w.nextRender(items.length)

      expect(Object.keys(w.items))
        .to.have.lengthOf(items.length)
        .and.include.members(items)

      expect(w.items.user)
        .to.have.lengthOf(1)
        .and.include(alias(1))

      expect(w.items.game1)
        .to.have.lengthOf(1)
        .and.include(alias(1))
      expect(w.items.game2)
        .to.have.lengthOf(1)
        .and.include(alias(2))

      expect(w.items.players1)
        .to.have.lengthOf(2)
        .and.include.members(alias([1, 2]))
      expect(w.items.players2)
        .to.have.lengthOf(3)
        .and.include.members(alias([1, 3, 5]))

      expect(w.items.usersInGame1)
        .to.have.lengthOf(2)
        .and.include.members(alias([1, 2]))
      expect(w.items.usersInGame2)
        .to.have.lengthOf(3)
        .and.include.members(alias([1, 3, 5]))
    })
  })
}
