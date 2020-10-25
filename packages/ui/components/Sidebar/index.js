import React from 'react'
import {
  observer,
  useComponentId,
  useLocal,
  useBind
} from 'startupjs'
import PropTypes from 'prop-types'
import { ScrollView, View, StyleSheet } from 'react-native'
import Div from '../Div'
import STYLES from './index.styl'

const { colors } = STYLES

function Sidebar ({
  style,
  sidebarStyle,
  contentStyle,
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

  return pug`
    Div.root(style=style styleName=[position])
      ScrollView.sidebar(
        contentContainerStyle=[{ backgroundColor, flex: 1 }, sidebarStyle]
        styleName={open}
        style={ width, backgroundColor }
      )= renderContent && renderContent()
      View.main(style=contentStyle)= children
  `
}

Sidebar.defaultProps = {
  defaultOpen: true,
  forceClosed: false,
  position: 'left',
  width: 264
}

Sidebar.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node,
  $open: PropTypes.object,
  defaultOpen: PropTypes.bool,
  forceClosed: PropTypes.bool,
  position: PropTypes.oneOf(['left', 'right']),
  width: PropTypes.number,
  renderContent: PropTypes.func
}

export default observer(Sidebar)
