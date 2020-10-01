import React, { useRef, useState, useMemo } from 'react'
import {
  observer,
  useComponentId,
  useDidUpdate,
  useLocal,
  useBind
} from 'startupjs'
import { ScrollView, Animated, StyleSheet } from 'react-native'
import propTypes from 'prop-types'
import Div from '../Div'
import STYLES from './index.styl'

const { colors } = STYLES

function Sidebar ({
  style,
  forceClosed,
  backgroundColor,
  children,
  position,
  path,
  $open,
  width,
  defaultOpen,
  renderContent,
  ...props
}) {
  if (path) {
    console.warn('[@startupjs/ui] Sidebar: path is DEPRECATED, use $open instead.')
  }

  if (/^#|rgb/.test(backgroundColor)) {
    console.warn('[@startupjs/ui] Sidebar:: Hex color for backgroundColor property is deprecated. Use style instead')
  }

  const componentId = useComponentId()
  if (!$open) {
    [, $open] = useLocal(path || `_session.Sidebar.${componentId}`)
  }

  // DEPRECATED: Remove backgroundColor
  ;({ backgroundColor = colors.white, ...style } = StyleSheet.flatten([
    { backgroundColor: colors[backgroundColor] || backgroundColor },
    style
  ]))

  let open
  let onChange
  ;({ open, onChange } = useBind({
    $open,
    open,
    onChange,
    default: forceClosed ? false : defaultOpen
  }))

  const [invisible, setInvisible] = useState(!open)
  const animation = useRef(new Animated.Value(open ? 1 : 0)).current
  const animationPropName = useMemo(() => {
    return 'padding' + position[0].toUpperCase() + position.slice(1)
  }, [])

  const _renderContent = () => {
    return pug`
      ScrollView(contentContainerStyle={ flex: 1 })
        = renderContent && renderContent()
    `
  }

  useDidUpdate(() => {
    if (forceClosed) onChange(false)
  }, [!!forceClosed])

  useDidUpdate(() => {
    if (forceClosed && invisible) return
    if (open) {
      setInvisible(false)
      Animated.timing(
        animation,
        {
          toValue: 1,
          duration: 250,
          useNativeDriver: true
        }
      ).start()
    } else {
      Animated.timing(
        animation,
        {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
        }
      ).start(({ finished }) => {
        if (finished) setInvisible(true)
      })
    }
  }, [!!open])

  return pug`
    Div.root(style=style styleName=[position])
      Animated.View.sidebar(
        style={
          [position]: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [-width, 0]
          }),
          width
        }
      )
        Div.sidebarContentWrapper(
          style={
            flex: 1,
            backgroundColor
          }
          styleName={invisible}
          level=1
        )
          = _renderContent()
      Animated.View.main(
        style={
          [animationPropName]: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, width]
          })
        }
      )= children
  `
}

Sidebar.defaultProps = {
  defaultOpen: true,
  forceClosed: false,
  position: 'left',
  width: 264
}

Sidebar.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  $open: propTypes.object,
  defaultOpen: propTypes.bool,
  forceClosed: propTypes.bool,
  position: propTypes.oneOf(['left', 'right']),
  width: propTypes.number,
  renderContent: propTypes.func
}

export default observer(Sidebar)
