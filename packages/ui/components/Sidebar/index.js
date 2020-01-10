import React from 'react'
import { observer } from 'startupjs'
import { ScrollView } from 'react-native'
import PropTypes from 'prop-types'
import Div from '../Div'
import config from './config'
import './index.styl'

function Sidebar ({
  backgroundColor,
  isOpen,
  position,
  width,
  children,
  nsPath,
  renderContent = () => null,
  ...props
}) {
  const _renderContent = () => {
    return pug`
      ScrollView(contentContainerStyle={flex: 1})
        = renderContent()
    `
  }
  return pug`
    Div.root(styleName=[position])
      Div.sidebar(
        shadow='s'
        styleName={isOpen}
        style={width, backgroundColor}
      )= _renderContent()
      Div.main= children
  `
}

Sidebar.propTypes = {
  backgroundColor: PropTypes.string,
  isOpen: PropTypes.bool,
  position: PropTypes.oneOf(['left', 'right']),
  width: PropTypes.number,
  renderContent: PropTypes.func.isRequired
}

Sidebar.defaultProps = {
  backgroundColor: config.backgroundColor,
  isOpen: config.isOpen,
  position: config.position,
  width: config.width
}

export default observer(Sidebar)
