import React from 'react'
import { View, Image } from 'react-native'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import randomcolor from 'randomcolor'
import Span from '../Span'
import './index.styl'

function Avatar ({
  style,
  url,
  size,
  fallback
}) {
  return pug`
    View.root(style=style styleName=[size])
      if url
        Image.avatar(
          styleName=[size]
          source={ uri: url }
        )
      else
        - const _fallback = fallback.trim()
        - const [firstName, lastName] = _fallback.split(' ')
        - const initials = (firstName ? firstName[0].toUpperCase() : '') + (lastName ? lastName[0].toUpperCase() : '')
        View.avatar(
          styleName=[size]
          style={backgroundColor: randomcolor({
            luminosity: 'bright',
            seed: _fallback
          })}
        )
          Span.fallback(size=size bold)
            = initials
  `
}

Avatar.propTypes = {
  url: propTypes.string,
  size: propTypes.oneOf(['xxl', 'xl', 'l', 'm', 's', 'xs']),
  fallback: propTypes.string
}

Avatar.defaultProps = {
  fallback: '?',
  size: 'm'
}

export default observer(Avatar)
