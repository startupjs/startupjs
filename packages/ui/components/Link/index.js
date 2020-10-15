import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import { Platform, Linking } from 'react-native'
import Div from './../Div'
import Span from './../typography/Span'
import { useHistory } from 'react-router-native'
import './index.styl'

const isWeb = Platform.OS === 'web'
const EXTERNAL_LINK_REGEXP = /^(https?:\/\/|\/\/)/i

function Link ({
  style,
  to,
  color,
  theme,
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

  // TODO:
  // For block=true modifier keys does not work
  // may be it is related issue https://github.com/necolas/react-native-web/issues/1591
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

      if (EXTERNAL_LINK_REGEXP.test(to)) {
        isWeb
          ? window.open(to, '_blank')
          : Linking.openURL(to)
      } else {
        const method = replace ? history.replace : history.push
        method(to)
      }
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
      styleName=[theme, { bold, italic, block }, color]
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
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  bold: Span.propTypes.bold,
  italic: Span.propTypes.italic,
  children: PropTypes.node,
  to: PropTypes.string.isRequired,
  replace: PropTypes.bool,
  block: PropTypes.bool,
  color: PropTypes.oneOf(['default', 'primary'])
}

export default observer(Link)
