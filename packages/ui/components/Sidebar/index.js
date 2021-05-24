import React from 'react'
import { ScrollView, View, StyleSheet } from 'react-native'
import {
  observer,
  useComponentId,
  useLocal,
  useBind
} from 'startupjs'
import PropTypes from 'prop-types'
import Div from '../Div'
import themed from '../../theming/themed'
import STYLES from './index.styl'

const { colors } = STYLES

function Sidebar ({
  style = [],
  sidebarStyle,
  contentStyle,
  children,
  position,
  path,
  $open,
  width,
  renderContent,
  ...props
}) {
  if (path) {
    console.warn('[@startupjs/ui] Sidebar: path is DEPRECATED, use $open instead.')
  }

  const componentId = useComponentId()
  if (!$open) {
    [, $open] = useLocal(path || `_session.Sidebar.${componentId}`)
  }

  let backgroundColor
  ;({ backgroundColor = colors.white, ...style } = StyleSheet.flatten(style))

  let open
  let onChange
  ;({ open, onChange } = useBind({
    $open,
    open,
    onChange
  }))

  return pug`
    Div.root(style=style styleName=[position])
      ScrollView.sidebar(
        contentContainerStyle=[{ flex: 1 }, sidebarStyle]
        styleName={open}
        style={ width, backgroundColor }
      )= renderContent && renderContent()
      View.main(style=contentStyle)= children
  `
}

Sidebar.defaultProps = {
  position: 'left',
  width: 264
}

Sidebar.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node,
  $open: PropTypes.object,
  position: PropTypes.oneOf(['left', 'right']),
  width: PropTypes.number,
  renderContent: PropTypes.func
}

export default observer(themed(Sidebar))
