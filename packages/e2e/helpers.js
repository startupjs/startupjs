const _ = require('lodash')

// -----------------------------------------------
//   Extend `element`
// -----------------------------------------------

// Hack to obtain prototype of the Element class
const ElementPrototype = Object.getPrototypeOf(element(by.id('DUMMY')))

/*eslint-disable*/
Object.assign(ElementPrototype, {
  async pickValue (columnValues) {
    let picker, confirm
    // DatePicker
    if (_.isPlainObject(columnValues)) {
      picker = x('RCTDatePicker UIPickerView')
      confirm = x('RCTView [= Confirm]')
      // Picker
    } else {
      columnValues = { 0: columnValues }
      picker = x('BzwPicker UIPickerView')
      confirm = x('BzwPicker [= Confirm]')
    }
    await this.tap()
    await picker.toBeVisible()
    for (let column in columnValues) {
      let value = columnValues[column]
      await picker.setColumnToValue(~~column, value)
    }
    await confirm.tap()
  }
})

// Proxy element/expect methods
const proxyHandler = {
  get: ({ selector }, propKey) => {
    return function (...args) {
      let matcher = getMatcher(selector)
      if (/^to/.test(propKey)) {
        return expect(element(matcher))[propKey](...args)
      } else {
        return element(matcher)[propKey](...args)
      }
    }
  }
}

/*
  x(selector) accepts 3 types of selectors:
  1. id -- has to start with '#'.
    Examples:
      $('#myButton')
  2. text -- has to start with '=' and for nested selectors you might need
    to wrap it into [].
    Examples:
      $('= My User Profile')
      $('[= My User Profile]')
      $('[= My TopBar] = Confirm Action')
  3. type -- starts with a letter.
    Examples:
      $('UIPickerView')

  It also supports ancestor selectors (same as in css, with space).
  Example: $('#topBar ="My User Profile"')
*/
module.exports = function x (selector) {
  return new Proxy({ selector }, proxyHandler)
}

const TEXT_REGEX = /^\[(?:[^\]\[]|\[(?:[^\[\]]|\[[^\]\[]*\])*\])*\]/

function getMatcher (selector) {
  selector = selector.trim()
  if (!selector) throw new Error('Empty selector')
  let first

  // First we getData complex situation when the first matcher is text which might have spaces:
  // x('[= First Element with text [yellow] [green]] [= Second element]')
  if (/^\[=/.test(selector)) {
    first = selector.match(TEXT_REGEX)[0]

    // Another special case is text matcher with omitted []
    // in which case we treat all spaces as part of it
  } else if (/^=/.test(selector)) {
    first = selector

    // Otherwise first element doesn't have any spaces
  } else {
    first = selector.match(/^\S+/)[0]
  }
  let second = selector.replace(first, '').trim()

  // Target (second) with Ancestor (first)
  if (second) {
    return getAtomicMatcher(second).withAncestor(getAtomicMatcher(first))

    // only Target
  } else {
    return getAtomicMatcher(first)
  }
}

function getAtomicMatcher (selector) {
  selector = selector.trim()
  // id
  if (/^#/.test(selector)) {
    selector = selector.replace(/^#/, '')
    return by.id(selector)
  }
  // text
  if (/^\[?=/.test(selector)) {
    if (/^\[/.test(selector)) {
      selector = selector.replace(/^\[/, '').replace(/\]$/, '')
    }
    selector = selector
      .replace(/^=\s*/, '')
      .replace(/^["']/, '')
      .replace(/["']$/, '')
    return by.text(selector)
  }
  // type
  if (!/\s/.test(selector)) return by.type(selector)
  // other
  throw new Error(`Unknown selector specified: ${selector}`)
}
