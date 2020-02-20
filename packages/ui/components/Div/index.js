import React, { useMemo, useState } from 'react'
import { View, TouchableOpacity, Platform } from 'react-native'
import propTypes from 'prop-types'
import { observer, useDidUpdate } from 'startupjs'
import config from '../../config/rootConfig'
import './index.styl'

const { hoverStateOpacity, activeStateOpacity } = config.Div
const SHADOWS = config.shadows
const isWeb = Platform.OS === 'web'

function Div ({
  style,
  children,
  disabled,
  level,
  interactive, // This prop doesn't make any sense without onPress
  activeOpacity,
  onPress,
  ...props
}) {
  const [hover, setHover] = useState()
  const isClickable = typeof onPress === 'function' && !disabled

  const Wrapper = isClickable ? TouchableOpacity : View

  const extraProps = useMemo(() => {
    let _props = {}

    if (isClickable) {
      _props.activeOpacity = 1
      _props.onPress = onPress

      if (interactive) {
        _props.activeOpacity = activeOpacity

        if (isWeb) {
          const { onMouseEnter, onMouseLeave } = props
          _props.onMouseEnter = (...args) => {
            setHover(true)
            onMouseEnter && onMouseEnter(...args)
          }
          _props.onMouseLeave = (...args) => {
            setHover()
            onMouseLeave && onMouseLeave(...args)
          }
        }
      }
    }

    return _props
  }, [isClickable, interactive])

  const extraStyles = useMemo(() => {
    const styles = {}

    if (hover) styles.opacity = hoverStateOpacity

    return styles
  }, [hover])

  // If component become not clickable, for example received 'disabled'
  // prop while hover or active, state wouldn't update without this effect
  useDidUpdate(() => {
    if (!isClickable || !interactive) setHover()
  }, [isClickable, interactive])

  return pug`
    Wrapper.root(
      style=[style, SHADOWS[level], extraStyles]
      styleName=[{ ['with-shadow']: !!level }]
      ...props
      ...extraProps
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
