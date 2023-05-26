import isString from 'lodash/isString.js'
import isArray from 'lodash/isArray.js'
import isBoolean from 'lodash/isBoolean.js'
import isNumber from 'lodash/isNumber.js'
import { _isExtraQuery as isExtraQuery } from '@startupjs/react-sharedb-util'

export function subLocal (localPath) {
  if (typeof localPath !== 'string') {
    throw new Error(
      `[react-sharedb] subLocal(): localPath must be a String. Got: ${localPath}`
    )
  }
  return {
    __subscriptionType: 'Local',
    params: localPath
  }
}

export function subDoc (collection, docId) {
  let invalid
  if (typeof collection !== 'string') {
    throw new Error(
      `[react-sharedb] subDoc(): \`collection\` must be a String. Got: ${collection}`
    )
  }
  if (docId == null) {
    console.warn(`
      [react-sharedb] subDoc(): You are trying to subscribe to an undefined document id:
        ${collection}.${docId}
      Falling back to '__NULL__' document to prevent critical crash.
      You should prevent situations when the \`docId\` is undefined.
    `)
    invalid = true
  }
  if (invalid) docId = '__NULL__'
  return {
    __subscriptionType: 'Doc',
    __subscriptionInvalid: invalid,
    params: [collection, docId]
  }
}

export function subQuery (collection, query) {
  let invalid
  if (typeof collection !== 'string') {
    throw new Error(
      `[react-sharedb] subQuery(): Collection must be String. Got: ${collection}`
    )
  }
  if (query == null) {
    console.warn(`
      [react-sharedb] subQuery(): Query is undefined. Got:
        ${collection}, ${query}
      Falling back to {_id: '__NON_EXISTENT__'} query to prevent critical crash.
      You should prevent situations when the \`query\` is undefined.
    `)
    invalid = true
  }
  if (
    isString(query) ||
    isArray(query) ||
    isBoolean(query) ||
    isNumber(query)
  ) {
    throw new Error(`
      [react-sharedb] subQuery(): Query is not an Object. Got:
        ${collection}, ${query}
      Query must always be an Object.
    `)
  }
  if (invalid) query = { _id: '__NON_EXISTENT__' }
  return {
    __subscriptionType: isExtraQuery(query) ? 'QueryExtra' : 'Query',
    __subscriptionInvalid: invalid,
    params: [collection, query]
  }
}

export function subValue (value) {
  return {
    __subscriptionType: 'Value',
    params: value
  }
}

export function subApi (path, fn, inputs, options) {
  if (typeof path === 'function') {
    options = inputs
    inputs = fn
    fn = path
    path = undefined
  }
  if (typeof fn !== 'function') {
    throw new Error(
      `[react-sharedb] subApi(): api Function (which must return promise) was not provided. Got: ${fn}`
    )
  }
  if (path != null && (typeof path !== 'string' || path === '')) {
    throw new Error(
      `[react-sharedb] subApi(): path must be a non-empty string. Got: ${path}`
    )
  }
  if (inputs != null && !isArray(inputs)) {
    if (isString(inputs) || isBoolean(inputs) || isNumber(inputs)) {
      throw new Error(
        '[react-sharedb] subApi(): inputs must be an array and ' +
          `options must be an object. Got: inputs - ${inputs}; options - ${options}`
      )
    }
    options = inputs
    inputs = undefined
  }
  if (
    options != null &&
    (isArray(options) || isString(options) || isBoolean(options))
  ) {
    throw new Error(
      `[react-sharedb] subApi(): options must be an object. Got: ${options}`
    )
  }
  if (options && options.debounce) {
    if (!isNumber(options.debounce)) {
      throw new Error(
        `[react-sharedb] subApi(): debounce must be a number (milliseconds). Got: ${options.debounce}`
      )
    }
  }
  return {
    __subscriptionType: 'Api',
    params: [path, fn, inputs, options]
  }
}
