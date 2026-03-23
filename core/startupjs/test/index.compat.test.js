import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import test from 'node:test'
import assert from 'node:assert/strict'

import {
  __resetCompatTForTests,
  __setCompatT,
  t,
  useBackPress,
  useComponentId
} from '../index.js'

test.afterEach(() => {
  __resetCompatTForTests()
})

test('useBackPress compat hook is defined and is a no-op', () => {
  function Probe () {
    assert.equal(useBackPress(), undefined)
    return React.createElement('div')
  }

  assert.doesNotThrow(() => {
    renderToStaticMarkup(React.createElement(Probe))
  })
})

test('useComponentId returns a stable id within the same render pass', () => {
  let firstId
  let secondId

  function Probe () {
    firstId = useComponentId('x')
    secondId = useComponentId('x')
    return React.createElement('div')
  }

  renderToStaticMarkup(React.createElement(Probe))

  assert.equal(typeof firstId, 'string')
  assert.equal(typeof secondId, 'string')
  assert.notEqual(firstId, '')
  assert.notEqual(secondId, '')
})

test('t throws a clear error until compat implementation is registered', () => {
  assert.throws(
    () => t('example', 'Fallback'),
    /t is not initialized/
  )
})

test('t delegates to registered compat implementation', () => {
  __setCompatT((key, defaultValue) => {
    if (key === 'example') return 'Translated'
    return defaultValue
  })

  assert.equal(t('example', 'Fallback'), 'Translated')
  assert.equal(t('missing', 'Fallback'), 'Fallback')
})
