import React, { useState, useMemo } from 'react'
import { observer, useComponentId, useLocal, useDidUpdate } from 'startupjs'
import { ScrollView, Animated } from 'react-native'
import propTypes from 'prop-types'
import Div from '../Div'
import config from '../../config/rootConfig'
import './index.styl'

const { colors } = config

function Sidebar ({
  style,
  forceClosed,
  backgroundColor,
  children,
  position,
  path,
  width,
  renderContent,
  ...props
}) {
  const _backgroundColor = useMemo(() => {
    return colors[backgroundColor] || backgroundColor
  }, [backgroundColor])
  const componentId = useComponentId()
  const [open] = useLocal(path || `_session.Sidebar.${componentId}`)
  const _open = useMemo(() => {
    if (forceClosed) {
      return false
    } else {
      return open
    }
  }, [!!forceClosed, !!open])
  const [invisible, setInvisible] = useState(!_open)
  const [animation] = useState(new Animated.Value(_open ? 0 : -width))
  const [contentAnimation] = useState(new Animated.Value(_open ? width : 0))
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
    if (_open) {
      setInvisible(false)
      Animated.parallel([
        Animated.timing(
          contentAnimation,
          {
            toValue: width,
            duration: 250
          }
        ),
        Animated.timing(
          animation,
          {
            toValue: 0,
            duration: 250
          }
        )
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(
          contentAnimation,
          {
            toValue: 0,
            duration: 200
          }
        ),
        Animated.timing(
          animation,
          {
            toValue: -width,
            duration: 200
          }
        )
      ]).start(() => {
        setInvisible(true)
      })
    }
  }, [!!_open])

  return pug`
    Div.root(style=style styleName=[position])
      Animated.View.sidebar(
        style={[position]: animation, width}
        styleName={invisible}
      )
        Div(level=1 style={
          flex: 1,
          backgroundColor: _backgroundColor
        })
          = _renderContent()
      Animated.View.main(
        style={
          [animationPropName]: contentAnimation
        }
      )= children
  `
}

Sidebar.defaultProps = {
  forceClosed: false,
  backgroundColor: config.colors.white,
  position: 'left',
  width: 264
}

Sidebar.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  forceClosed: propTypes.bool,
  backgroundColor: propTypes.string,
  position: propTypes.oneOf(['left', 'right']),
  width: propTypes.number,
  renderContent: propTypes.func
}

export default observer(Sidebar)
