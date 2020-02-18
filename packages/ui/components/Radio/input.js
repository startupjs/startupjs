import React, { useState } from 'react'
import { View, Animated } from 'react-native'
import { observer, useDidUpdate } from 'startupjs'
import propTypes from 'prop-types'
import Div from '../Div'
import Span from '../Span'
import './index.styl'

const Input = function ({
  children,
  color,
  textColor,
  value,
  label,
  checked,
  onPress
}) {
  const [checkedSize] = useState(new Animated.Value(checked ? 1 : 0))

  const setChecked = () => {
    onPress && onPress(value)
  }

  useDidUpdate(() => {
    checkedSize.setValue(0)
    if (checked) {
      Animated.timing(
        checkedSize,
        {
          toValue: 1,
          duration: 120
        }
      ).start()
    }
  }, [checked])

  return pug`
    Div.root(
      onPress=setChecked
    )
      View.circle(
        style={borderColor: color}
        styleName={ 'with-label': !!label }
      )
        if checked
          Animated.View.checked(
            style={
              backgroundColor: color,
              transform: [{
                scale: checkedSize
              }]
            }
          )
      Span.label(style={color: textColor})= label
  `
}

Input.propType = {
  checked: propTypes.bool
}

export default observer(Input)
