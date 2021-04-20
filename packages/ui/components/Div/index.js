import React, { useRef, useState } from 'react'
import {
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Animated
} from 'react-native'
import { observer, useDidUpdate } from 'startupjs'
import PropTypes from 'prop-types'
import { colorToRGBA } from '../../helpers'
import Portal from '../Portal'
import usePopover from '../popups/Popover/usePopover'
import STYLES from './index.styl'

const STEPS = {
  CLOSE: 'close',
  RENDER: 'render',
  ANIMATE: 'animate',
  OPEN: 'open'
}

const isWeb = Platform.OS === 'web'

const {
  config: {
    defaultHoverOpacity,
    defaultActiveOpacity
  },
  shadows: SHADOWS
} = STYLES

function Div ({
  style = [],
  children,
  variant,
  hoverStyle,
  activeStyle,
  disabled,
  level,
  feedback,
  shape,
  pushed, // By some reason prop 'push' was ignored
  bleed,
  accessible,
  renderTooltip,
  onPress,
  onLongPress,
  _preventEvent,
  ...props
}) {
  const isClickable = onPress || onLongPress
  const ref = useRef()
  const [hover, setHover] = useState()
  const [active, setActive] = useState()
  const [isShowTooltip, setIsShowTooltip] = useState(false)

  const {
    step,
    refAnimate,
    locationStyle,
    animateStyle
  } = usePopover({
    style,
    visible: isShowTooltip,
    refCaption: ref
  })
  // const { tooltipProps } = useTooltip(setIsShowTooltip)

  let extraStyle = {}
  const extraProps = {}
  const wrapperProps = { accessible }
  // If component become not clickable, for example received 'disabled'
  // prop while hover or active, state wouldn't update without this effect

  // TODO disabled
  useDidUpdate(() => {
    if (isClickable) return
    if (!disabled) return
    if (hover) setHover()
    if (active) setActive()
  }, [isClickable, disabled])

  if (isClickable) {
    wrapperProps.onPress = (e) => {
      // prevent bubbling event (default browser behavior)
      // make it consistent with native mobiles
      if (_preventEvent || disabled) {
        e.persist() // TODO: remove in react 17
        e.preventDefault()
      }
      if (disabled) return
      onPress && onPress(e)
    }
    wrapperProps.onLongPress = (e) => {
      // prevent bubbling event (default browser behavior)
      // make it consistent with native mobiles
      if (_preventEvent || disabled) {
        e.persist() // TODO: remove in react 17
        e.preventDefault()
      }
      if (disabled) return
      onLongPress && onLongPress(e)
    }

    // setup hover and active states styles and props
    if (feedback && !disabled) {
      const { onPressIn, onPressOut } = props
      wrapperProps.onPressIn = (...args) => {
        setActive(true)
        onPressIn && onPressIn(...args)
      }
      wrapperProps.onPressOut = (...args) => {
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

      if (active) {
        extraStyle = activeStyle || getDefaultStyle(style, 'active', variant)
      } else if (hover) {
        extraStyle = hoverStyle || getDefaultStyle(style, 'hover', variant)
      }
    }
  }

  let pushedModifier
  let levelModifier
  const pushedSize = typeof pushed === 'boolean' && pushed ? 'm' : pushed
  if (pushedSize) pushedModifier = `pushed-${pushedSize}`
  // skip level 0 for shadow
  // because it needed only when you want to override shadow from style sheet
  if (level) levelModifier = `shadow-${level}`

  function maybeWrapToClickable (children) {
    if (isClickable) {
      return pug`
        TouchableWithoutFeedback(...wrapperProps)= children
      `
    } else {
      return children
    }
  }

  const div = pug`
    View.root(
      ref=ref
      style=[style, extraStyle]
      styleName=[
        {
          clickable: isWeb && isClickable,
          bleed,
          disabled
        },
        shape,
        pushedModifier,
        levelModifier
      ]
      ...extraProps
      ...props
    )= children
  `

  if (renderTooltip) {
    return pug`
      TouchableWithoutFeedback(
        onPress=() => setIsShowTooltip(true)
      )= div

      Portal
        if step !== STEPS.CLOSE
          View(style={
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0
          })
            TouchableOpacity(
              onPress=() => setIsShowTooltip(false)
              style={
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0
              }
            )
            View(style=locationStyle)
              Animated.View(
                ref=refAnimate
                style=animateStyle
              )= renderTooltip()
    `
  }

  // backgroundColor in style can override extraStyle backgroundColor
  // so passing the extraStyle to the end is important in this case
  return maybeWrapToClickable(div)
}

Div.defaultProps = {
  variant: 'opacity',
  level: 0,
  feedback: true,
  disabled: false,
  bleed: false,
  pushed: false,
  _preventEvent: true
}

Div.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node,
  variant: PropTypes.oneOf(['opacity', 'highlight']),
  feedback: PropTypes.bool,
  hoverStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  activeStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  disabled: PropTypes.bool,
  level: PropTypes.oneOf(Object.keys(SHADOWS).map(i => ~~i)),
  shape: PropTypes.oneOf(['squared', 'rounded', 'circle']),
  pushed: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['xs', 's', 'm', 'l', 'xl', 'xxl'])]),
  bleed: PropTypes.bool,
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
  _preventEvent: PropTypes.bool
}

export default observer(Div)

function getDefaultStyle (style, type, variant) {
  if (variant === 'opacity') {
    if (type === 'hover') return { opacity: defaultHoverOpacity }
    if (type === 'active') return { opacity: defaultActiveOpacity }
  } else {
    style = StyleSheet.flatten(style)
    let backgroundColor = style.backgroundColor
    if (backgroundColor === 'transparent') backgroundColor = undefined

    if (type === 'hover') {
      if (backgroundColor) {
        return { backgroundColor: colorToRGBA(backgroundColor, defaultHoverOpacity) }
      } else {
        // If no color exists, we treat it as a light background and just dim it a bit
        return { backgroundColor: 'rgba(0, 0, 0, 0.05)' }
      }
    }

    if (type === 'active') {
      if (backgroundColor) {
        return { backgroundColor: colorToRGBA(backgroundColor, defaultActiveOpacity) }
      } else {
        // If no color exists, we treat it as a light background and just dim it a bit
        return { backgroundColor: 'rgba(0, 0, 0, 0.2)' }
      }
    }
  }
}
