import React from 'react'
import { observer } from 'startupjs'
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import Div from '../../Div'
import Card from '../../Card'
import Button from '../../Button'
import themed from '../../../theming/themed'
import './index.styl'

function ArrayInput ({
  style,
  inputStyle,
  $value,
  layout,
  items
}) {
  if (!$value || !items) {
    return null
  }

  const pure = layout === 'pure'
  const value = $value.get()

  function getInputs () {
    return (value || []).map((_, index) => {
      return {
        ...items,
        key: index,
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
        Card(
          style=[style, inputStyle]
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
          Input(...input)
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
  items: PropTypes.object.isRequired
}

export default observer(
  themed('ArrayInput', ArrayInput),
  { forwardRef: true }
)

// FIX circular imports https://stackoverflow.com/a/30390378
// for unknown reasons ObjectInput that also have circular imports works well
const Input = require('../Input')
