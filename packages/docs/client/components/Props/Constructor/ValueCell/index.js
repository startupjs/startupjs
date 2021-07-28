import React, { useCallback, useMemo } from 'react'
import { observer, useValue } from 'startupjs'
import { Br, Input, Span } from '@startupjs/ui'
import debounce from 'lodash/debounce'
import isPlainObject from 'lodash/isPlainObject'
import keys from 'lodash/keys'
import omit from 'lodash/omit'
import * as icons from '@fortawesome/free-solid-svg-icons'
import '../index.styl'

const EDITABLE_TYPES = ['string', 'number', 'bool', 'oneOf', 'array', 'object']

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

const PropInput = observer(function ({ $value, options, type, value }) {
  switch (type) {
    case 'array':
    case 'object':
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
          value=value || ''
          onChangeText=value => $value.set(value)
        )
      `
    case 'number':
      return pug`
        Input(
          size='s'
          type='number'
          value=value
          onChangeNumber=value => $value.set(value)
        )
      `
    case 'bool':
      return pug`
        Input.checkbox(
          type='checkbox'
          value=value
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
          )
      `
    default:
      return null
  }
})

const TypesSelect = observer(function ({ $props, entry: { name, possibleValues } }) {
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

  async function onChange (value) {
    await $value.del()
    $selectedValue.set(value)
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
        options=options[selectedValue]
        type=selectedValue
        value=value
      )
    else
      Span.unsupported -
  `
})

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
    PropInput(
      $value=$value
      options=_icons
      type='oneOf'
      value=value
    )
  `
})

export default observer(function ValueCell ({ $props, entry }) {
  const { name, type, possibleValues, extraParams } = entry
  const $value = $props.at(name)
  const value = $value.get()

  if (/^\$/.test(name)) { // hide Input for model prop
    return pug`
      Span.unsupported -
    `
  }

  if (extraParams?.showIconSelect) {
    return pug`
      IconSelect($value=$value value=value)
    `
  }

  return pug`
    if EDITABLE_TYPES.includes(type)
      PropInput(
        $value=$value
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
    default:
      return false
  }
}
