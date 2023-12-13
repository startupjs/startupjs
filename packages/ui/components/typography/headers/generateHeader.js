import React from 'react'
import { Platform, Text } from 'react-native'
import { pug, observer, styl } from 'startupjs'
import PropTypes from 'prop-types'
import themed from '../../../theming/themed'

export default function generateHeader (tag) {
  const header = observer(themed(tag.toUpperCase(),
    function Header ({ children, style, bold, italic, full, ...props }) {
      const isWeb = Platform.OS === 'web'
      const role = isWeb
        ? { accessibilityRole: 'header', accessibilityLevel: tag.replace(/^h/, '') }
        : {}

      return pug`
        Text.root(
          styleName=[tag, { bold, italic, full }]
          style=style
          ...role
          ...props
        )= children
      `
    }
  ))

  header.defaultProps = {
    bold: false,
    italic: false
  }

  header.propTypes = {
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    children: PropTypes.node,
    full: PropTypes.bool,
    bold: PropTypes.bool,
    italic: PropTypes.bool
  }

  return header
}

styl`
  _tags = ('h1' 'h2' 'h3' 'h4' 'h5' 'h6')

  .root
    fontFamily('heading')
    color var(--color-text-main)

    for tag in _tags
      &.{tag}
        font(tag)

    &.bold
      fontFamily('heading', $UI.fontWeights.headingBold)

    &.italic
      fontFamily('heading', $UI.fontWeights.heading, italic)

    &.bold.italic
      fontFamily('heading', $UI.fontWeights.headingBold, italic)

    &.full
      flex: 1
`
