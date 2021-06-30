import React from 'react'
import { observer } from 'startupjs'
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import { SCHEMA_TYPE_TO_INPUT } from '../helpers'
import Input from '../Input'
import Div from '../../Div'
import Card from '../../Card'
import Button from '../../Button'
import Span from '../../typography/Span'
import themed from '../../../theming/themed'
import { useLayout } from './../../../hooks'
import './index.styl'

function ArrayInput ({
  style,
  inputStyle,
  $value,
  label,
  description,
  layout,
  items
}) {
  if (!$value || !items) {
    return null
  }

  layout = useLayout({ layout, label, description })

  const pure = layout === 'pure'
  const value = $value.get()

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
    if (pure) {
      return pug`
        Div(style=[style, inputStyle])= children
      `
    } else {
      return pug`
        Div(style=style)
          Div.info
            if label
              Span.label= label
            if description
              Span.description(description)= description
          Card(
            style=inputStyle
            variant='outlined'
          )
            = children
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

ArrayInput.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  inputStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  $value: PropTypes.any.isRequired,
  label: PropTypes.string,
  description: PropTypes.string,
  layout: PropTypes.oneOf(['pure', 'rows']),
  items: PropTypes.object.isRequired
}

export default observer(themed(ArrayInput))
