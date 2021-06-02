import React from 'react'
import { observer } from 'startupjs'
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'
import { SCHEMA_TYPE_TO_INPUT } from '../helpers'
import Input from '../Input'
import Div from '../../Div'
import Card from '../../Card'
import Button from '../../Button'
import Span from '../../typography/Span'
import themed from '../../../theming/themed'
import './index.styl'

function ArrayInput ({
  style,
  inputStyle,
  $value,
  label,
  items
}) {
  const value = $value.get()

  if (!items) {
    console.error('[ui -> Array] items is required')
    return null
  }

  function getInputs () {
    return (value || []).map((_, index) => {
      const { input, type, ...inputProps } = items
      return {
        ...inputProps,
        key: index,
        type: input || SCHEMA_TYPE_TO_INPUT[type] || type,
        $value: $value.at(index)
      }
      // TODO: When the dependsOn field changes and this field is no longer visible -- clear it.
    }).filter(Boolean)
  }

  const inputs = getInputs()

  function renderContainer (children) {
    if (label) {
      return pug`
        Div(style=style)
          Span.label(description)= label
          Card(
            style=inputStyle
            variant='outlined'
          )
            = children
      `
    } else {
      return pug`
        Div(style=[style, inputStyle])= children
      `
    }
  }

  // TODO: Instead of just a delete icon, make a three dots menu with things like:
  //         - delete
  //         - move up
  //         - move down
  //         - add new item before
  //         - add new item after
  return renderContainer(pug`
    each input, index in inputs
      Div.item(key=index styleName={ pushTop: index !== 0 })
        Div.input
          - const { style, ...inputProps } = input
          Input(
            ...inputProps
            style=style
          )
        Div.actions
          Button.remove(
            size='s'
            variant='text'
            icon=faTimes
            onPress=() => $value.remove(index)
          )
    Button.add(
      styleName={ pushTop: inputs.length !== 0 }
      variant='text'
      icon=faPlus
      onPress=() => $value.push(undefined)
    )
  `)
}

export default observer(themed(ArrayInput))
