import React, { useMemo, useState, useLayoutEffect } from 'react'
import { View, TouchableOpacity } from 'react-native'
import propTypes from 'prop-types'
import { observer } from 'startupjs'
import config from '../../config/rootConfig'
import './index.styl'

const { hoverStateOpacity, activeStateOpacity } = config.Div
const SHADOWS = config.shadows

function Div ({
  style,
  children,
  disabled,
  level,
  interactive,
  activeOpacity,
  onMouseEnter,
  onMouseLeave,
  onPress,
  ...props
}) {
  const [hover, setHover] = useState()
  const isClickable = typeof onPress === 'function' && !disabled

  const Wrapper = isClickable ? TouchableOpacity : View

  const extraProps = useMemo(() => {
    let props = {}

    if (isClickable) {
      props.activeOpacity = 1
      props.onPress = onPress

      if (interactive) {
        props.activeOpacity = activeOpacity

        props.onMouseEnter = (...args) => {
          setHover(true)
          onMouseEnter && onMouseEnter(...args)
        }

        props.onMouseLeave = (...args) => {
          setHover()
          onMouseLeave && onMouseLeave(...args)
        }
      }
    }

    return props
  }, [isClickable, interactive])

  const extraStyles = useMemo(() => {
    const styles = {}

    if (hover) styles.opacity = hoverStateOpacity

    return styles
  }, [hover])

  // If component become not clickable, for example received 'disabled'
  // prop while hover or active, state wouldn't update without this effect
  useLayoutEffect(() => {
    if (!isClickable || !interactive) setHover()
  }, [isClickable, interactive])

  return pug`
    Wrapper.root(
      style=[style, SHADOWS[level], extraStyles]
      styleName=[{ ['with-shadow']: !!level }]
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
