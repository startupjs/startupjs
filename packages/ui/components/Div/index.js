import React from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, View } from 'react-native'
import { observer } from 'startupjs'
import SHADOWS from './shadows'
import './index.styl'

function Div ({
  style,
  children,
  shadow,
  onPress,
  ...props
}) {
  let Wrapper = typeof onPress === 'function'
    ? TouchableOpacityWithShadow
    : View

  const shadowProps = SHADOWS[shadow] ? SHADOWS[shadow] : {}

  return pug`
    Wrapper.root(
      style=style
      styleName=[shadow, { 'with-shadow': !!shadow }]
      ...shadowProps
      onPress=onPress
      ...props
    )
      = children
  `
}

Div.propTypes = {
  shadow: PropTypes.oneOf(Object.keys(SHADOWS)),
  onPress: PropTypes.func
}

const TouchableOpacityWithShadow = observer(({
  style,
  children,
  onPress,
  ...props
}) => {
  return pug`
    View(style=style ...props)
      TouchableOpacity(
        style={flex: 1}
        onPress=onPress
      )= children
  `
})

export default observer(Div)
