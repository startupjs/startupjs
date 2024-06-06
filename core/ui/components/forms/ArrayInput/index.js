import React from 'react'
import { pug, observer } from 'startupjs'
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
  const arrayLength = $value.get()?.length || 0

  if (!$value || !items) return null

  function getInputs () {
    return Array(arrayLength + 1).fill().map((_, index) => {
      return {
        ...items,
        key: index,
        $value: $value[index]
      }
    })
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
        Div.actions(vAlign='center' align='right')
          if index < arrayLength
            Button.remove(
              tabIndex=-1
              size='s'
              variant='text'
              icon=faTimes
              onPress=() => $value[index].del()
              color='text-subtle'
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
