import React, { useState, useMemo } from 'react'
import { observer, emit, useDidUpdate } from 'startupjs'
import propTypes from 'prop-types'
import { Link as RNLink } from 'react-router-native'
import { View, Platform, TouchableOpacity } from 'react-native'
import Icon from './../Icon'
import Span from './../Span'
import _omit from 'lodash/omit'
import config from '../../config/rootConfig'
import colorToRGBA from '../../config/colorToRGBA'
import './index.styl'

const { colors } = config
const isWeb = Platform.OS === 'web'

function Link ({
  style,
  children,
  size,
  bold,
  italic,
  icon,
  rightIcon,
  replace,
  disabled,
  ...props
}) {
  const [hover, setHover] = useState()
  const [active, setActive] = useState()
  const iconWrapperStyle = { 'with-label': !!children }

  useDidUpdate(() => {
    if (!disabled) return
    if (hover) setHover()
    if (active) setActive()
  }, [disabled])

  if (!disabled) {
    const { onPressIn, onPressOut } = props

    props.onPressIn = (...args) => {
      setActive(true)
      onPressIn && onPressIn(...args)
    }
    props.onPressOut = (...args) => {
      setActive()
      onPressOut && onPressOut(...args)
    }

    if (isWeb) {
      const { onMouseEnter, onMouseLeave } = props

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

  // React router native link is inconsitent with react router link
  // For web it returns href in props, for native in returns onPress
  const extraProps = useMemo(() => {
    if (!isWeb) return {}
    return {
      component: ({ style, href, children, ...props }) => {
        return pug`
          TouchableOpacity(
            style=style
            activeOpacity=1
            onPress=() => emit('url', href, { replace })
            ...props
          )= children
        `
      }
    }
  }, [])

  const color = useMemo(() => {
    return disabled
      ? colorToRGBA(colors.dark, 0.8)
      : active
        ? colors.secondary
        : hover
          ? colorToRGBA(colors.primary, 0.8)
          : colors.primary
  }, [disabled, hover, active])

  return pug`
    RNLink.root(style=style ...props ...extraProps)
      if icon
        View.leftIconWrapper(styleName=[iconWrapperStyle])
          Icon(icon=icon color=color size=size)
      if children
        Span.label(
          style={color}
          styleName={disabled}
          bold=bold
          italic=italic
          size=size
        )= children
      if rightIcon
        View.rightIconWrapper(styleName=[iconWrapperStyle])
          Icon(icon=rightIcon color=color size=size)
  `
}

Link.defaultProps = {
  ...Span.defaultProps,
  replace: false,
  disabled: false
}

Link.propTypes = {
  ..._omit(Span.propTypes, ['description']),
  to: propTypes.string,
  icon: propTypes.object,
  rightIcon: propTypes.object,
  replace: propTypes.bool,
  disabled: propTypes.bool
}

export default observer(Link)
