import React, { useRef, useState } from 'react'
import {
  View,
  TouchableWithoutFeedback,
  Platform,
  StyleSheet
} from 'react-native'
import { observer, useDidUpdate } from 'startupjs'
import PropTypes from 'prop-types'
import pick from 'lodash/pick'
import colorToRGBA from '../../helpers/colorToRGBA'
import Span from '../typography/Span'
import AbstractPopover from '../AbstractPopover'
import useTooltip from './useTooltip'
import themed from '../../theming/themed'
import STYLES from './index.styl'

const DEPRECATED_PUSHED_VALUES = ['xs', 'xl', 'xxl']

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
  tooltipProps,
  onPress,
  onLongPress,
  _preventEvent,
  ...props
}, ref) {
  if (DEPRECATED_PUSHED_VALUES.includes(pushed)) {
    console.warn(`[@startupjs/ui] Div: variant='${pushed}' is DEPRECATED, use one of 's', 'm', 'l' instead.`)
  }

  const isClickable = onPress || onLongPress
  const [hover, setHover] = useState()
  const [active, setActive] = useState()

  let extraStyle = {}
  const wrapperProps = { accessible }
  // If component become not clickable, for example received 'disabled'
  // prop while hover or active, state wouldn't update without this effect

  const refAnchor = ref || useRef()
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)

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

  if (typeof renderTooltip !== 'undefined') {
    // TODO: Move all logic to useTooltip hook along with the tooltip html
    const tooltipActions = useTooltip({ onChange: setIsTooltipVisible })

    if (isWeb) {
      const { onMouseOver, onMouseLeave } = props

      props.onMouseOver = (...args) => {
        tooltipActions.onOpen()
        onMouseOver && onMouseOver(...args)
      }
      props.onMouseLeave = (...args) => {
        tooltipActions.onClose()
        onMouseLeave && onMouseLeave(...args)
      }
    } else {
      const { onPress, onLongPress } = wrapperProps

      wrapperProps.onPress = (...args) => {
        if (onLongPress && !onPress) onLongPress(...args)
        if (onPress) onPress(...args)
      }

      wrapperProps.onLongPress = () => {
        tooltipActions.onOpen()
      }

      wrapperProps.onPressOut = () => {
        tooltipActions.onClose()
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
    if (isClickable || (renderTooltip && !isWeb)) {
      return pug`
        TouchableWithoutFeedback(...wrapperProps)
          = children
      `
    } else {
      return children
    }
  }

  // backgroundColor in style can override extraStyle backgroundColor
  // so passing the extraStyle to the end is important in this case
  const div = maybeWrapToClickable(pug`
    View.root(
      ref=refAnchor
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

  return pug`
    = div

    if renderTooltip
      - const simple = typeof renderTooltip === 'string'
      AbstractPopover.tooltip(
        refAnchor=refAnchor
        styleName={ simple }
        arrowStyleName='tooltip-arrow'
        visible=isTooltipVisible
        ...tooltipProps
      )
        if typeof renderTooltip === 'function'
          = renderTooltip()
        else if simple
          Span.tooltip-text= renderTooltip
  `
}

Div.defaultProps = {
  variant: 'opacity',
  level: 0,
  feedback: true,
  disabled: false,
  bleed: false,
  pushed: false,
  tooltipProps: {
    position: 'top',
    attachment: 'center',
    durationOpen: AbstractPopover.defaultProps.durationOpen,
    durationClose: AbstractPopover.defaultProps.durationClose,
    arrow: true
  },
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
  pushed: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['s', 'm', 'l'])]),
  bleed: PropTypes.bool,
  tooltipProps: PropTypes.shape(
    pick(
      AbstractPopover.propTypes,
      [
        'style',
        'arrowStyle',
        'position',
        'attachment',
        'placements',
        'arrow',
        'matchAnchorWidth',
        'durationOpen',
        'durationClose',
        'renderWrapper',
        'onRequestOpen',
        'onRequestClose',
        'onCompleteOpen',
        'onCompleteClose'
      ]
    )
  ),
  renderTooltip: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string
  ]),
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
  _preventEvent: PropTypes.bool
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
