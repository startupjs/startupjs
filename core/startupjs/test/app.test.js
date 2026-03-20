import test from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import RouterContext from '@startupjs/utils/RouterContext'
import {
  __setCompatPathFor,
  __setCompatUseRouter,
  __resetCompatPathForForTests,
  pathFor,
  useHistory
} from '../app.js'

test.afterEach(() => {
  __resetCompatPathForForTests()
})

test('pathFor throws a clear error until compat implementation is registered', () => {
  assert.throws(
    () => pathFor('admin:users'),
    /pathFor is not initialized/
  )
})

test('pathFor delegates to registered compat implementation', () => {
  __setCompatPathFor((name, params = {}) => `/route/${name}/${params.id || ''}`)
  assert.equal(pathFor('admin:tenant', { id: '42' }), '/route/admin:tenant/42')
})

test('useHistory maps push/replace/goBack to the router contract', () => {
  const calls = []
  const router = {
    navigate: (...args) => calls.push(['navigate', ...args]),
    replace: (...args) => calls.push(['replace', ...args]),
    back: (...args) => calls.push(['back', ...args])
  }
  __setCompatUseRouter(() => router)

  function Probe () {
    const history = useHistory()
    history.push('/one', { a: 1 })
    history.replace('/two')
    history.goBack()
    return React.createElement('div')
  }

  renderToStaticMarkup(
    React.createElement(
      RouterContext.Provider,
      { value: router },
      React.createElement(Probe)
    )
  )

  assert.deepEqual(calls, [
    ['navigate', '/one', { a: 1 }],
    ['replace', '/two'],
    ['back']
  ])
})

test('useHistory falls back to navigate("..") when router.back is missing', () => {
  const calls = []
  const router = {
    navigate: (...args) => calls.push(['navigate', ...args]),
    replace: (...args) => calls.push(['replace', ...args])
  }
  __setCompatUseRouter(() => router)

  function Probe () {
    const history = useHistory()
    history.goBack()
    return React.createElement('div')
  }

  renderToStaticMarkup(
    React.createElement(
      RouterContext.Provider,
      { value: router },
      React.createElement(Probe)
    )
  )

  assert.deepEqual(calls, [
    ['navigate', '..']
  ])
})

test('useHistory throws a clear error until compat useRouter is registered', () => {
  function Probe () {
    useHistory()
    return React.createElement('div')
  }

  assert.throws(
    () => renderToStaticMarkup(React.createElement(Probe)),
    /useHistory is not initialized/
  )
})
