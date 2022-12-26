import React, { useRef, useState, useImperativeHandle } from 'react'
import {
  View,
  TouchableWithoutFeedback,
  Platform,
  StyleSheet
} from 'react-native'
import { observer, useDidUpdate } from 'startupjs'
import pick from 'lodash/pick'
import omit from 'lodash/omit'
import PropTypes from 'prop-types'
import colorToRGBA from '../../helpers/colorToRGBA'
import useTooltip from './useTooltip'
import themed from '../../theming/themed'
import STYLES from './index.styl'

const DEPRECATED_PUSHED_VALUES = ['xs', 'xl', 'xxl']
const PRESSABLE_PROPS = ['onPress', 'onLongPress', 'onPressIn', 'onPressOut']
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
  full,
  accessible,
  tooltip,
  tooltipStyle,
  renderTooltip,
  ...props
}, ref) {
  if (DEPRECATED_PUSHED_VALUES.includes(pushed)) {
    console.warn(`[@startupjs/ui] Div: variant='${pushed}' is DEPRECATED, use one of 's', 'm', 'l' instead.`)
  }

  if (renderTooltip) {
    console.warn('[@startupjs/ui] Div: renderTooltip is DEPRECATED, use \'tooltip\' property instead.')
  }

  const isClickable = hasPressHandler(props)
  const [hover, setHover] = useState(false)
  const [active, setActive] = useState(false)

  let extraStyle = {}
  const viewRef = useRef()

  useImperativeHandle(ref, () => viewRef.current, [])

  // If component become not clickable, for example received 'disabled'
  // prop while hover or active, state wouldn't update without this effect
  useDidUpdate(() => {
    if (!isClickable) return
    if (!disabled) return
    if (hover) setHover(false)
    if (active) setActive(false)
  }, [isClickable, disabled])

  if (isClickable) {
    // setup hover and active states styles and props
    if (feedback) {
      const { onPressIn, onPressOut } = props

      props.onPressIn = (...args) => {
        setActive(true)
        onPressIn && onPressIn(...args)
      }
      props.onPressOut = (...args) => {
        setActive(false)
        onPressOut && onPressOut(...args)
      }

      if (isWeb && !disabled) {
        const { onMouseEnter, onMouseLeave } = props

        props.onMouseEnter = (...args) => {
          setHover(true)
          onMouseEnter && onMouseEnter(...args)
        }
        props.onMouseLeave = (...args) => {
          setHover(false)
          onMouseLeave && onMouseLeave(...args)
        }
      }
    }

    for (const prop of PRESSABLE_PROPS) {
      const pressHandler = props[prop]
      if (!pressHandler) continue
      props[prop] = (...args) => {
        if (disabled) return
        pressHandler(...args)
      }
    }
  }

  const { tooltipElement, tooltipEventHandlers } = useTooltip({
    style: tooltipStyle,
    anchorRef: viewRef,
    tooltip
  })

  for (const tooltipEventHandlerName in tooltipEventHandlers) {
    const divHandler = props[tooltipEventHandlerName]
    const tooltipHandler = tooltipEventHandlers[tooltipEventHandlerName]

    props[tooltipEventHandlerName] = divHandler
      ? (...args) => { tooltipHandler(...args); divHandler(...args) }
      : tooltipHandler
  }

  let pushedModifier
  let levelModifier
  const pushedSize = typeof pushed === 'boolean' && pushed ? 'm' : pushed
  if (pushedSize) pushedModifier = `pushed-${pushedSize}`
  // skip level 0 for shadow
  // because it needed only when you want to override shadow from style sheet
  if (level) levelModifier = `shadow-${level}`

  // hover or active state styles
  // active state takes precedence over hover state
  if (active) {
    extraStyle = activeStyle || getDefaultStyle(style, 'active', variant)
  } else if (hover) {
    extraStyle = hoverStyle || getDefaultStyle(style, 'hover', variant)
  }

  function maybeWrapToClickable (children) {
    if (isClickable) {
      const touchableProps = pick(props, PRESSABLE_PROPS)
      return pug`
        TouchableWithoutFeedback(accessible ...touchableProps)
          = children
      `
    } else {
      return children
    }
  }

  const viewProps = omit(props, PRESSABLE_PROPS)

  // backgroundColor in style can override extraStyle backgroundColor
  // so passing the extraStyle to the end is important in this case
  const divElement = maybeWrapToClickable(pug`
    View.root(
      ref=viewRef
      style=[style, extraStyle]
      styleName=[
        {
          clickable: isWeb && isClickable,
          bleed,
          full,
          disabled
        },
        shape,
        pushedModifier,
        levelModifier
      ]
      ...viewProps
    )= children
  `)

  return pug`
    = divElement
    = tooltipElement
  `
}

function hasPressHandler (props) {
  return PRESSABLE_PROPS.some(prop => props[prop])
}

Div.defaultProps = {
  variant: 'opacity',
  level: 0,
  feedback: true,
  disabled: false,
  bleed: false,
  pushed: false
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
  pushed: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['s', 'm', 'l'])]),
  bleed: PropTypes.bool,
  full: PropTypes.bool,
  tooltip: PropTypes.string,
  tooltipStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onPress: PropTypes.func,
  onLongPress: PropTypes.func
}

export default observer(themed('Div', Div), { forwardRef: true })

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
