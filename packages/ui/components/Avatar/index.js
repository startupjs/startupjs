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
  let initials
  if (fallback) {
    const [firstName, lastName] = fallback.split(' ')
    initials = firstName[0].toUpperCase() +
      (lastName ? lastName[0].toUpperCase() : '')
  }

  return pug`
    View.root(style=style styleName=[size])
      if url
        Image.avatar(
          styleName=[size]
          source={ uri: url }
        )
      else
        View.avatar(
          styleName=[size]
          style={backgroundColor: randomcolor({
            luminosity: 'bright',
            seed: fallback
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
