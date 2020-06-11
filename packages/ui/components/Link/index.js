import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import { Platform } from 'react-native'
import Div from './../Div'
import Span from './../typography/Span'
import { useHistory } from 'react-router-native'
import './index.styl'

const isWeb = Platform.OS === 'web'

function Link ({
  style,
  to,
  color,
  theme,
  size,
  bold,
  italic,
  block,
  replace,
  variant,
  onPress,
  ...props
}) {
  const Component = block ? Div : Span
  const extraProps = { accessibilityRole: 'link' }
  const history = useHistory()

  function handlePress (event) {
    try {
      if (onPress) onPress(event)
    } catch (err) {
      event.preventDefault()
      throw err
    }

    if (!event.defaultPrevented) {
      if (isWeb) {
        // ignore clicks with modifier keys
        // let browser handle these clicks
        if (isModifiedEvent(event)) return
        event.preventDefault()
      }
      const method = replace ? history.replace : history.push
      method(to)
    }
  }

  if (block) {
    extraProps.variant = variant
  }

  if (isWeb) {
    extraProps.href = to
    // makes preventDefault work on web,
    // because react-native onPress does not prevent ctrl + click on web
    extraProps.onClick = handlePress
  } else {
    extraProps.onPress = handlePress
  }

  return pug`
    Component.root(
      style=style
      styleName=[theme, size, { bold, italic, block }, color]
      ...extraProps
      ...props
    )
  `
}

function isModifiedEvent (event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
}

Link.defaultProps = {
  bold: Span.defaultProps.bold,
  italic: Span.defaultProps.italic,
  replace: false,
  block: false,
  color: 'default'
}

Link.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  bold: Span.propTypes.bold,
  italic: Span.propTypes.italic,
  children: propTypes.node,
  to: propTypes.string,
  replace: propTypes.bool,
  block: propTypes.bool,
  color: propTypes.oneOf(['default', 'primary'])
}

export default observer(Link)
