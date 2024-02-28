import React from 'react'
import { pug, observer, signal } from 'startupjs'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import PropTypes from 'prop-types'
import Div from '../../Div'
import Button from '../../Button'
import themed from '../../../theming/themed'
import Input from '../Input'
import './index.styl'

function ArrayInput ({
  style,
  inputStyle,
  $value,
  items,
  _renderWrapper
}) {
  if (!$value || !items) {
    return null
  }

  const value = $value.get()

  function getInputs () {
    return (value || []).map((_, index) => {
      return {
        ...items,
        key: index,
        $value: signal($value)[index]
      }
      // TODO: When the dependsOn field changes and this field is no longer visible -- clear it.
    }).filter(Boolean)
  }

  const inputs = getInputs()

  if (!_renderWrapper) {
    _renderWrapper = (style, children) => {
      return pug`
        Div(style=style)= children
      `
    }
  }

  // TODO: Instead of just a delete icon, make a three dots menu with things like:
  //         - delete
  //         - move up
  //         - move down
  //         - add new item before
  //         - add new item after
  return _renderWrapper({
    style: [style, inputStyle]
  }, pug`
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
  themed('ArrayInput', ArrayInput)
)
