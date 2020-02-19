import React, { useMemo } from 'react'
import { View, TouchableOpacity } from 'react-native'
import propTypes from 'prop-types'
import { observer } from 'startupjs'
import config from '../../config/rootConfig'
import './index.styl'

const { activeStateOpacity } = config.Div
const SHADOWS = config.shadows

function Div ({
  style,
  children,
  disabled,
  level,
  interactive,
  activeOpacity,
  onPress,
  ...props
}) {
  const isClickable = typeof onPress === 'function' && !disabled

  const Wrapper = isClickable ? TouchableOpacity : View

  const extraProps = useMemo(() => {
    if (isClickable) {
      return { onPress }
    }
    return {}
  }, [isClickable])

  return pug`
    Wrapper.root(
      style=[style, SHADOWS[level]]
      styleName=[{
        clickable: isClickable,
        ['with-shadow']: !!level,
        interactive
      }]
      activeOpacity=interactive ? activeOpacity : 1
      ...extraProps
      ...props
    )
      = children
  `
}

Div.defaultProps = {
  activeOpacity: activeStateOpacity,
  disabled: false,
  interactive: true,
  level: 0
}

Div.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  activeOpacity: propTypes.number,
  disabled: propTypes.bool,
  interactive: propTypes.bool,
  level: propTypes.oneOf(SHADOWS.map((key, index) => index)),
  children: propTypes.node,
  onPress: propTypes.func
}

export default observer(Div)
