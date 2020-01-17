import React, { useState, useMemo } from 'react'
import { observer, useComponentId, useSession } from 'startupjs'
import { ScrollView, Animated } from 'react-native'
import { useDidUpdate } from '@startupjs/react-sharedb'
import PropTypes from 'prop-types'
import Div from '../Div'
import config from '../../config/rootConfig'
import './index.styl'

function Sidebar ({
  backgroundColor,
  children,
  position,
  path,
  width,
  renderContent = () => null,
  ...props
}) {
  const componentId = useComponentId()
  const [open] = useSession(path || `Sidebar.${componentId}`)
  const [invisible, setInvisible] = useState(!open)
  const [animation] = useState(new Animated.Value(open ? 0 : -width))
  const [contentAnimation] = useState(new Animated.Value(open ? width : 0))
  const animationPropName = useMemo(() => {
    return 'padding' + position[0].toUpperCase() + position.slice(1)
  }, [])
  const _renderContent = () => {
    return pug`
      ScrollView(
        contentContainerStyle={ flex: 1 }
      )
        = renderContent()
    `
  }

  useDidUpdate(() => {
    if (open) {
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
  }, [!!open])

  return pug`
    Div.root(styleName=[position])
      Animated.View.sidebar(
        style={[position]: animation, width}
        styleName={invisible}
      )
        Div(level=1 style={flex: 1})
          = _renderContent()
      Animated.View.main(
        style={
          [animationPropName]: contentAnimation
        }
      )= children
  `
}

Sidebar.propTypes = {
  backgroundColor: PropTypes.string,
  position: PropTypes.oneOf(['left', 'right']),
  width: PropTypes.number,
  renderContent: PropTypes.func.isRequired
}

Sidebar.defaultProps = {
  backgroundColor: config.colors.white,
  position: 'left',
  width: 264
}

export default observer(Sidebar)
