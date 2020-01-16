import React, { useState } from 'react'
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

  const [animation] = useState(new Animated.Value(open ? width : 0))
  const _renderContent = () => {
    return pug`
      ScrollView(
        style={width}
        contentContainerStyle={flexGrow: 1}
      )
        = renderContent()
    `
  }

  useDidUpdate(() => {
    if (open) {
      Animated.timing(
        animation,
        {
          toValue: width,
          duration: 250
        }
      ).start()
    } else {
      Animated.timing(
        animation,
        {
          toValue: 0,
          duration: 200
        }
      ).start()
    }
  }, [!!open])

  return pug`
    Div.root(styleName=[position])
      Div(level=1)
        Animated.View(
          style={flex: 1, width: animation, overflow: 'hidden'}
        )= _renderContent()
      Div.main= children
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
