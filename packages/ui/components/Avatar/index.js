import React, { useState } from 'react'
import { Image } from 'react-native'
import { observer, useDidUpdate } from 'startupjs'
import Div from './../Div'
import propTypes from 'prop-types'
import randomcolor from 'randomcolor'
import Span from '../Span'
import './index.styl'

function Avatar ({
  style,
  src,
  size,
  status,
  shape,
  children,
  ...props
}) {
  const [error, setError] = useState()
  useDidUpdate(setError, [src])

  return pug`
    Div.root(style=style styleName=[size] ...props log=true)
      Div.avatarWrapper(shape=shape)
        if src && !error
          Image.avatar(
            source={ uri: src }
            onError=() => {
              setError(true)
            }
          )
        else
          - const _fallback = children.trim()
          - const [firstName, lastName] = _fallback.split(' ')
          - const initials = (firstName ? firstName[0].toUpperCase() : '') + (lastName ? lastName[0].toUpperCase() : '')
          Div.avatar(
            styleName=[size]
            style={backgroundColor: randomcolor({
              luminosity: 'bright',
              seed: _fallback
            })}
          )
            Span.fallback(size=size bold)
              = initials
      if status
        Div.status(styleName=[size, status, shape])
  `
}

Avatar.defaultProps = {
  children: '?',
  size: 'm',
  shape: 'circle',
  disabled: Div.defaultProps.disabled
}

Avatar.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  src: propTypes.string,
  size: propTypes.oneOf(['xxl', 'xl', 'l', 'm', 's', 'xs']),
  shape: Div.propTypes.shape,
  status: propTypes.oneOf(['online', 'away']),
  children: propTypes.string,
  disabled: Div.propTypes.disabled,
  onPress: Div.propTypes.onPress
}

export default observer(Avatar)
