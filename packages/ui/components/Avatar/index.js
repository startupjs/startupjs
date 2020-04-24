import React, { useState } from 'react'
import { View, Image } from 'react-native'
import { observer, useDidUpdate } from 'startupjs'
import propTypes from 'prop-types'
import randomcolor from 'randomcolor'
import Span from '../Span'
import './index.styl'

function Avatar ({
  style,
  url,
  size,
  status,
  fallback
}) {
  const [error, setError] = useState()
  useDidUpdate(setError, [url])

  return pug`
    View.root(style=style styleName=[size])
      View.avatarWrapper(styleName=[size])
        if url && !error
          Image.avatar(
            source={ uri: url }
            onError=() => {
              setError(true)
            }
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
      if status
        View.status(styleName=[size, status])
  `
}

Avatar.defaultProps = {
  fallback: '?',
  size: 'm'
}

Avatar.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  url: propTypes.string,
  size: propTypes.oneOf(['xxl', 'xl', 'l', 'm', 's', 'xs']),
  status: propTypes.oneOf(['online', 'away']),
  fallback: propTypes.string
}

export default observer(Avatar)
