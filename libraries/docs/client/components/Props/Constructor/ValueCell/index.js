import React, { useCallback, useMemo } from 'react'
import { pug, batch, observer, $ } from 'startupjs'
import { Br, Input, Span } from '@startupjs/ui'
import debounce from 'lodash/debounce'
import isPlainObject from 'lodash/isPlainObject'
import keys from 'lodash/keys'
import omit from 'lodash/omit'
// TODO: IMPORTANT! Refactor this to NOT import all icons
//       since it HUGELY bloats the bundle size
import * as icons from '@fortawesome/free-solid-svg-icons'
import '../index.styl'

const EDITABLE_TYPES = ['string', 'number', 'boolean', 'oneOf', 'array', 'object']

const IconSelect = observer(function ({ $value, value }) {
  const _icons = useMemo(
    () =>
      keys(omit(icons, ['fas', 'prefix'])).map(key => ({
        label: key,
        value: icons[key]
      })),
    []
  )

  return pug`
    Input(
      options=_icons
      size='s'
      type='select'
      value=value
      onChange=value => $value.set(value)
    )
`
})

const JSONInput = observer(function ({ $value, type }) {
  const _JSONValue = useMemo(() => {
    const value = $value.get()
    return value ? JSON.stringify(value) : ''
  }, [$value])

  const $tempJSON = $(_JSONValue)
  const $badJSON = $(false)

  const validateJson = useCallback( // eslint-disable-line react-hooks/exhaustive-deps
    debounce(text => {
      try {
        if (!text) {
          $value.del() // clear value if no text
        } else {
          const parsedValue = JSON.parse(text)
          const isValidValue = parsedValue && validateByType(type, parsedValue)
          if (isValidValue) {
            $value.set(parsedValue)
            $badJSON.set(false)
          } else {
            $badJSON.set(true)
          }
        }
      } catch (error) {
        $badJSON.set(true)
      }
    }, 300),
    [$badJSON, $value]
  )

  function onChangeJSON (text) {
    $tempJSON.set(text)
    validateJson(text)
  }

  return pug`
    Input(
      inputStyleName={ badJSON: $badJSON.get() }
      size='s'
      type='text'
      value=$tempJSON.get() || ''
      onChangeText=onChangeJSON
    )
  `
})

const PropInput = observer(function ({ $value, extraParams = {}, options, type, value }) {
  switch (type) {
    case 'array':
    case 'object':
      // custom Select for icon objects instead of JSONInput
      // when extraParams.showIconSelect is true
      if (extraParams.showIconSelect) {
        return pug`
          IconSelect($value=$value value=value)
        `
      }
      return pug`
        JSONInput(
          type=type
          value=value
          $value=$value
        )
      `
    case 'string':
      return pug`
        Input(
          size='s'
          type='text'
          value=value
          onChangeText=value => $value.set(value)
          ...extraParams
        )
      `
    case 'number':
      return pug`
        Input(
          size='s'
          type='number'
          value=value
          onChangeNumber=value => $value.set(value)
          ...extraParams
        )
      `
    case 'boolean':
      return pug`
        Input.checkbox(
          type='checkbox'
          value=!!value
          onChange=value => $value.set(value)
        )
      `
    case 'oneOf':
      return pug`
        Input(
          options=options
          size='s'
          type='select'
          value=value
          onChange=value => $value.set(value)
          ...extraParams
        )
      `
    default:
      return null
  }
})

const TypesSelect = observer(function ({
  $props,
  entry: { name, defaultValue, possibleValues, extraParams = {} }
}) {
  const { names, options } = useMemo(
    () =>
      possibleValues.reduce(
        (acc, { name, value }) => {
          if (!EDITABLE_TYPES.includes(name)) return acc
          acc.names.push(name)
          acc.options[name] = Array.isArray(value) ? value : []
          return acc
        },
        { names: [], options: {} }
      ),
    [possibleValues]
  )
  const $selectedValue = $(names[0])
  const $value = $props[name]
  const value = $value.get()

  function onChange (value) {
    batch(() => {
      if (defaultValue !== undefined && validateByType(value, defaultValue)) {
        $value.set(defaultValue)
      } else {
        $value.del()
      }
      $selectedValue.set(value)
    })
  }

  return pug`
    if names.length
      Input(
        options=names
        showEmptyValue=false
        size='s'
        type='select'
        value=$selectedValue.get()
        onChange=onChange
      )
      Br(half)
      PropInput(
        $value=$value
        extraParams=extraParams
        options=options[$selectedValue.get()]
        type=$selectedValue.get()
        value=value
      )
    else
      Span.unsupported -
  `
})

export default observer(function ValueCell ({ $props, entry }) {
  const { extraParams, name, possibleValues, type } = entry
  const $value = $props[name]
  const value = $value.get()

  if (/^\$/.test(name)) { // hide Input for model prop
    return pug`
      Span.unsupported -
    `
  }

  return pug`
    if EDITABLE_TYPES.includes(type)
      PropInput(
        $value=$value
        extraParams=extraParams
        options=possibleValues
        type=type
        value=value
      )
    else if type === 'oneOfType'
      TypesSelect($props=$props entry=entry)
    else
      Span.unsupported -
  `
})

function validateByType (type, value) {
  switch (type) {
    case 'array':
      return Array.isArray(value)
    case 'object':
      return isPlainObject(value)
    case 'boolean':
      return typeof value === 'boolean'
    case 'number':
      return typeof value === 'number'
    case 'string':
      return typeof value === 'string'
    case 'oneOf':
      return true
    default:
      return false
  }
}
