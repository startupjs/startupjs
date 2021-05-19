import React from 'react'
import { Platform, Text } from 'react-native'
import { observer, styl } from 'startupjs'
import PropTypes from 'prop-types'

export default function generateHeader (tag) {
  const header = observer(
    ({ children, style, bold, italic, ...props }) => {
      const isWeb = Platform.OS === 'web'
      const role = isWeb
        ? { accessibilityRole: 'heading', 'aria-level': tag.replace(/^h/, '') }
        : {}

      return pug`
        Text.root(
          styleName=[tag, { bold, italic }]
          style=style
          ...role
          ...props
        )= children
      `
    }
  )

  header.defaultProps = {
    bold: false,
    italic: false
  }

  header.propTypes = {
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    children: PropTypes.node,
    bold: PropTypes.bool,
    italic: PropTypes.bool
  }

  return header
}

styl`
    _tags = ('h1' 'h2' 'h3' 'h4' 'h5' 'h6')

    .root
      fontFamily('heading')

      for tag in _tags
        &.{tag}
          font(tag)

      &.bold
        fontFamily('heading', $UI.fontWeights.headingBold)

      &.italic
        fontFamily('heading', $UI.fontWeights.heading, italic)

      &.bold.italic
        fontFamily('heading', $UI.fontWeights.headingBold, italic)
  `
