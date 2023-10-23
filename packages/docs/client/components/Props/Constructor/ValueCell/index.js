import React, { useCallback, useMemo } from 'react'
import { pug, batch, observer, useValue } from 'startupjs'
import { Br, Input, Span } from '@startupjs/ui'
import debounce from 'lodash/debounce'
import isPlainObject from 'lodash/isPlainObject'
import keys from 'lodash/keys'
import omit from 'lodash/omit'
import * as icons from '@fortawesome/free-solid-svg-icons'
import '../index.styl'

const EDITABLE_TYPES = ['string', 'number', 'bool', 'oneOf', 'array', 'object']

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
    let value = $value.get()
    return value ? JSON.stringify(value) : ''
  }, [$value])

  const [tempJSON, $tempJSON] = useValue(_JSONValue)
  const [badJSON, $badJSON] = useValue(false)

  const validateJson = useCallback(
    debounce(text => {
      try {
        if (!text) {
          $value.del() // clear value if no text
        } else {
          const parsedValue = JSON.parse(text)
          const isValidValue = parsedValue && validateByType(type, parsedValue)
          if (isValidValue) {
            $value.set(parsedValue)
            $badJSON.setDiff(false)
          } else {
            $badJSON.setDiff(true)
          }
        }
      } catch (error) {
        $badJSON.setDiff(true)
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
      inputStyleName={ badJSON }
      size='s'
      type='text'
      value=tempJSON || ''
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
    case 'bool':
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
  const [selectedValue, $selectedValue] = useValue(names[0])
  const $value = $props.at(name)
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
        value=selectedValue
        onChange=onChange
      )
      Br(half)
      PropInput(
        $value=$value
        extraParams=extraParams
        options=options[selectedValue]
        type=selectedValue
        value=value
      )
    else
      Span.unsupported -
  `
})

export default observer(function ValueCell ({ $props, entry }) {
  const { extraParams, name, possibleValues, type } = entry
  const $value = $props.at(name)
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
    case 'bool':
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
