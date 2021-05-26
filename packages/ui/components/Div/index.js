import React, { useRef, useState } from 'react'
import {
  View,
  TouchableWithoutFeedback,
  Platform,
  StyleSheet,
  Animated
} from 'react-native'
import { observer, useDidUpdate } from 'startupjs'
import PropTypes from 'prop-types'
import { colorToRGBA } from '../../helpers'
import Portal from '../Portal'
import Span from '../typography/Span'
import usePopover from '../popups/Popover/usePopover'
import useTooltip from '../Tooltip/useTooltip'
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
  tooltipProps = {},
  renderTooltip,
  renderTooltipWrapper,
  _showTooltip,
  onPress,
  onLongPress,
  _preventEvent,
  ...props
}) {
  const refCaption = useRef()
  const refAnimate = useRef()
  const [hover, setHover] = useState()
  const [active, setActive] = useState()

  // we expect to receive boolean
  const isTooltipControllable = _showTooltip !== undefined
  const [isShowTooltip, setIsShowTooltip] = useState(isTooltipControllable ? _showTooltip : false)

  if (isTooltipControllable) {
    useDidUpdate(() => {
      setIsShowTooltip(_showTooltip)
    }, [_showTooltip])
  }

  const {
    step,
    positionStyle,
    animateStyle,
    arrow
  } = usePopover({
    attachment: isTooltipControllable ? 'start' : 'center',
    position: isTooltipControllable ? 'bottom' : 'top',
    animateType: isTooltipControllable ? 'opacity' : 'scale',
    durationOpen: 200,
    durationClose: 100,
    hasArrow: !isTooltipControllable,
    arrowStyle: STYLES.arrowStyle,
    ...tooltipProps,
    style,
    refAnimate,
    refCaption,
    renderTooltip,
    visible: isShowTooltip
  })

  let extraStyle = {}
  const tooltipActions = useTooltip({
    isTooltipControllable,
    onPress,
    onLongPress,
    onChange: setIsShowTooltip
  })

  const wrapperProps = { accessible }
  // If component become not clickable, for example received 'disabled'
  // prop while hover or active, state wouldn't update without this effect
  const isClickable = onPress || onLongPress ||
    (renderTooltip && !isTooltipControllable && !isWeb)

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
      tooltipActions.onPress ? tooltipActions.onPress(e) : onPress(e)
    }
    wrapperProps.onLongPress = (e) => {
      // prevent bubbling event (default browser behavior)
      // make it consistent with native mobiles
      if (_preventEvent || disabled) {
        e.persist() // TODO: remove in react 17
        e.preventDefault()
      }
      if (disabled) return
      tooltipActions.onLongPress ? tooltipActions.onLongPress(e) : onLongPress(e)
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
        tooltipActions.onPressOut && tooltipActions.onPressOut()
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

  if (isWeb && renderTooltip && !isTooltipControllable) {
    const { onMouseOver, onMouseLeave } = props

    props.onMouseOver = () => {
      tooltipActions.onMouseOver()
      onMouseOver && onMouseOver()
    }
    props.onMouseLeave = () => {
      tooltipActions.onMouseLeave()
      onMouseLeave && onMouseLeave()
    }
  }

  function maybeWrapToClickable (children) {
    if (isClickable || renderTooltip) {
      return pug`
        TouchableWithoutFeedback(...wrapperProps)= children
      `
    } else {
      return children
    }
  }

  // backgroundColor in style can override extraStyle backgroundColor
  // so passing the extraStyle to the end is important in this case
  const div = maybeWrapToClickable(pug`
    View.root(
      ref=refCaption
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
      ...props
    )= children
  `)

  if (renderTooltip) {
    let tooltipContent = pug`
      View(style=positionStyle)
        Animated.View(
          ref=refAnimate
          style=animateStyle
        )
          = arrow
          Div(
            styleName={
              tooltipContent: !isTooltipControllable,
              popoverContent: isTooltipControllable,
              popoverContentArrow: isTooltipControllable 
                && tooltipProps.hasArrow
            }
            style=tooltipProps.contentStyle
          )
            if typeof renderTooltip === 'string'
              Span.text= renderTooltip
            else
              = renderTooltip()
    `

    if (renderTooltipWrapper) {
      tooltipContent = renderTooltipWrapper({
        children: tooltipContent
      })
    }

    return pug`
      = div
      Portal
        if step !== STEPS.CLOSE
          = tooltipContent
    `
  }

  return div
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
