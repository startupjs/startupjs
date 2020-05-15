import React from 'react'
import { observer, emit } from 'startupjs'
import propTypes from 'prop-types'
import { Platform } from 'react-native'
import Div from './../Div'
import Span from './../Typography/Span'
import './index.styl'

const isWeb = Platform.OS === 'web'

function Link ({
  style,
  to,
  variant,
  theme,
  size,
  bold,
  italic,
  block,
  replace,
  onPress,
  ...props
}) {
  const Component = block ? Div : Span
  const extraProps = { accessibilityRole: 'link' }

  function handlePress (event) {
    try {
      if (onPress) onPress(event)
    } catch (err) {
      event.preventDefault()
      throw err
    }

    if (!event.defaultPrevented) {
      if (isWeb) event.preventDefault()
      emit('url', to, { replace })
    }
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
      styleName=[theme, size, { bold, italic, block }, variant]
      ...props
      ...extraProps
    )
  `
}

Link.defaultProps = {
  ...Span.defaultProps,
  replace: false,
  block: false,
  variant: 'default'
}

Link.propTypes = {
  ...Span.propTypes,
  to: propTypes.string,
  replace: propTypes.bool,
  block: propTypes.bool,
  variant: propTypes.oneOf(['default', 'primary'])
}

export default observer(Link)
