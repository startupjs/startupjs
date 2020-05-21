import React from 'react'
import { observer } from 'startupjs'
import Input from '../Input'
import './index.styl'

export default observer(function ObjectInput ({
  style,
  $value,
  value,
  properties,
  order
}) {
  if (!$value) {
    console.error('[ui -> Object] $value is required')
    return null
  }
  if (!properties) {
    console.error('[ui -> Object] properties is required')
    return null
  }

  order = getOrder(order, properties)

  return pug`
    each key, index in order
      - const { input, dependsOn, dependsValue, ...inputProps } = properties[key] || {}
      if resolvesDeps(value, dependsOn, dependsValue)
        Input.input(
          ...inputProps
          key=key
          styleName={ pushTop: index !== 0 }
          type=input
          $value=$value.at(key)
        )
      //- TODO: When the dependsOn field changes and this field is no longer visible -- clear it.
      else
        - console.log('TODO: clear') // TODO
  `
})

function getOrder (order, properties) {
  return order != null ? order : Object.keys(properties)
}

function resolvesDeps (value = {}, dependsOn, dependsValue) {
  return (
    // always show if dependsOn field doesn't exist
    !dependsOn ||
    // dependsValue is value
    (dependsValue != null && value[dependsOn] === dependsValue) ||
    // dependsValue is array
    (dependsValue != null && Array.isArray(dependsValue) &&
      dependsValue.indexOf(value[dependsOn]) !== -1
    ) ||
    // dependsValue is not present, check that value[dependsOn] has something
    (
      (dependsValue == null || (typeof dependsValue === 'string' && dependsValue.trim() === '')) &&
      value[dependsOn] != null &&
      !(typeof value[dependsOn] === 'string' && value[dependsOn].trim() === '')
    )
  )
}
