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
  fallback,
  onPress
}) {
  let _fallback
  if (fallback) {
    const splitedFalback = fallback.split(' ')
    _fallback = splitedFalback[0].charAt(0)

    if (splitedFalback.length > 1) {
      _fallback += splitedFalback[1].charAt(0)
    }

    _fallback = _fallback.toUpperCase()
  }

  return pug`
    View.root(style=style styleName=[size] onPress=onPress)
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
            = _fallback
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
