import React from 'react'
import ReactWrapper from 'enzyme/build/ReactWrapper'
import { createWaitForElement } from '@oskarer/enzyme-wait'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import TestRenderer from 'react-test-renderer'
import _ from 'lodash'

const DEPRECATED = process.env.DEPRECATED

init()

function init () {
  Enzyme.configure({ adapter: new Adapter() })

  ReactWrapper.prototype.waitFor = function (selector) {
    return createWaitForElement(selector)(this)
  }
}

export function unmount () {
  if (globalEnzymeNode && globalEnzymeNode.unmount) {
    globalEnzymeNode.unmount()
    globalEnzymeNode = undefined
  }
  if (globalTestRenderer && globalTestRenderer.unmount) {
    globalTestRenderer.unmount()
    globalTestRenderer = undefined
  }
}

export function convertToOldSubscribeParams (fn) {
  return (...args) => {
    let data = fn(...args)
    let res = {}
    for (let key in data) {
      if (data[key] == null) continue
      if (data[key].__subscriptionType) {
        res[key] = data[key].params
      } else {
        throw new Error('No __subscriptionType specified')
      }
    }
    return res
  }
}

export function convertToHooksSubscribeParams (fn) {
  return (...args) => {
    let { items: { __subscriptionType: type, params } } = fn(...args)
    let useFn
    switch (type) {
      case 'Doc':
        useFn = useDoc
        break
      case 'Query':
      case 'QueryExtra':
        useFn = useQuery
        break
      case 'Local':
        useFn = useLocal
        break
      case 'Value':
        useFn = useValue
        break
      case 'Api':
        useFn = useApi
        break
      default:
        throw new Error('Unknown useFn type: ' + type)
    }
    if (!_.isArray(params)) params = [params]
    return useFn(...params)
  }
}

export async function initSimple (initialProps, subscribeFn) {
  if (typeof initialProps === 'function') {
    subscribeFn = initialProps
    initialProps = {}
  }
  if (DEPRECATED) subscribeFn = convertToOldSubscribeParams(subscribeFn)
  let Subscribed = subscribe(subscribeFn)(Simple())
  let w = mount(<Subscribed {...initialProps} />)
  globalEnzymeNode = w
  await w.waitFor('.Simple')
  w.getItems = function () {
    return getSimpleItems(this)
  }
  Object.defineProperty(w, 'items', {
    get: function () {
      return this.getItems()
    }
  })
  w.nextRender = function (...args) {
    return nextRender(this, ...args)
  }
  return w
}

export function getSimpleItems (w) {
  let text = w.find('.Simple').text()
  if (!text) return []
  return text.split(',')
}

export async function initComplex (initialProps, subscribeFn) {
  if (typeof initialProps === 'function') {
    subscribeFn = initialProps
    initialProps = {}
  }
  if (DEPRECATED) subscribeFn = convertToOldSubscribeParams(subscribeFn)
  let Subscribed = subscribe(subscribeFn)(Complex())
  let w = mount(<Subscribed {...initialProps} />)
  globalEnzymeNode = w

  await w.waitFor('.Complex')
  w.getItems = function () {
    return getComplexItems(this)
  }
  Object.defineProperty(w, 'items', {
    get: function () {
      return this.getItems()
    }
  })
  w.nextRender = function (...args) {
    return nextRender(this, ...args)
  }
  return w
}

export function getComplexItems (w) {
  let res = []
  for (let i = 0; i < 10; i++) {
    let el = w.find(`.items${i}`)
    if (!el.exists()) break
    let text = el.text()
    let value
    if (!text) {
      value = []
    } else {
      value = text.split(',')
    }
    res.push(value)
  }
  return res
}

export async function tInitHooksComplex (initialProps = {}) {
  let Component = HooksComplex()
  globalTestRenderer = TestRenderer.create(<Component {...initialProps} />)
  let t = globalTestRenderer
  t.getItems = function () {
    return tGetHooksComplexItems(this)
  }
  Object.defineProperty(t, 'items', {
    get: function () {
      return this.getItems()
    }
  })
  t.nextRender = function (...args) {
    return tNextRender(this, ...args)
  }
  return t
}

export function tGetHooksComplexItems (t) {
  let res = {}
  t.root.findAllByProps({ className: 'items' }).forEach(node => {
    let name = node.props.title
    let text = (node.children && node.children[0]) || ''
    res[name] = text.split(',')
  })
  return res
}

export async function tInitHooksSimple (initialProps, useFn) {
  if (typeof initialProps === 'function') {
    useFn = initialProps
    initialProps = {}
  }
  let Component = HooksSimple(useFn)
  globalTestRenderer = TestRenderer.create(<Component {...initialProps} />)
  let t = globalTestRenderer
  t.getItems = function () {
    return tGetSimpleItems(this)
  }
  Object.defineProperty(t, 'items', {
    get: function () {
      return this.getItems()
    }
  })
  t.nextRender = function (...args) {
    return tNextRender(this, ...args)
  }
  t.setProps = function (props = {}) {
    t.update(<Component {...props} />)
  }
  return t
}

export function tGetSimpleItems (t) {
  let node = t.root.findByProps({ className: 'items' })
  let text = (node.children && node.children[0]) || ''
  return text.split(',').filter(Boolean)
}

export async function tNextRender (t, count = 1, fn, params) {
  if (typeof count === 'function') {
    params = fn
    fn = count
    count = 1
  }
  if (fn && typeof fn !== 'function') {
    params = fn
    fn = undefined
  }
  if (count && typeof count !== 'number') {
    params = count
    count = 1
  }
  let { index } = params || {}
  if (index == null) {
    let currentRender = t.root.findByProps({ className: 'root' }).props.title
    if (!currentRender) throw new Error("Component didn't render")
    currentRender = ~~currentRender
    index = currentRender + count
  }
  let selector = { className: 'root', title: '' + index }
  typeof DEBUG !== 'undefined' && console.log('wait for:', selector)
  if (fn) fn()
  let found = false
  while (!found) {
    try {
      t.root.findByProps(selector)
      found = true
    } catch (e) {
      await new Promise(cb => setTimeout(cb, 10))
    }
  }
}

export async function nextRender (w, count = 1, fn, params) {
  if (typeof count === 'function') {
    params = fn
    fn = count
    count = 1
  }
  if (fn && typeof fn !== 'function') {
    params = fn
    fn = undefined
  }
  if (count && typeof count !== 'number') {
    params = count
    count = 1
  }
  let { index } = params || {}
  if (index == null) {
    let currentRender = w.html().match(/RENDER-(\d+)/)[1]
    if (!currentRender) throw new Error("Component didn't render")
    currentRender = ~~currentRender
    index = currentRender + count
  }
  let selector = `.RENDER-${index}`
  typeof DEBUG !== 'undefined' && console.log('wait for:', selector)
  if (fn) fn()
  await w.waitFor(selector)
}
