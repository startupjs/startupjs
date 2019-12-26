import React, { useLayoutEffect } from 'react'
import { observer, useLocal } from 'startupjs'
import { ScrollView } from 'react-native'
import PropTypes from 'prop-types'
import Div from '../Div'
import config from './config'
import './index.styl'

function Sidebar ({
  backgroundColor,
  defaultOpen,
  position,
  width,
  children,
  nsPath,
  renderContent,
  ...props
}) {
  const [isOpen, $isOpen] = useLocal(ns(nsPath, 'isOpen'))

  useLayoutEffect(() => {
    if (isOpen === undefined) $isOpen.set(defaultOpen)
  }, [])

  const _renderContent = () => {
    return pug`
      ScrollView(contentContainerStyle={flex: 1})
        = renderContent()
    `
  }
  return pug`
    Div.root(styleName=[position])
      Div.sidebar(
        styleName={isOpen}
        style={width, backgroundColor}
      )= _renderContent()
      Div.main= children
  `
}

Sidebar.propTypes = {
  backgroundColor: PropTypes.string,
  defaultOpen: PropTypes.bool,
  nsPath: PropTypes.string,
  position: PropTypes.oneOf(['left', 'right']),
  width: PropTypes.number,
  renderContent: PropTypes.func.isRequired
}

Sidebar.defaultProps = {
  backgroundColor: config.backgroundColor,
  defaultOpen: config.defaultOpen,
  nsPath: config.nsPath,
  position: config.position,
  width: config.width,
  renderContent: config.renderContent
}

export default observer(Sidebar)

function ns (path, subpath) {
  if (subpath) return path + '.' + subpath
  return path
}
