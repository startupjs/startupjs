import React, { useState } from 'react'
import { Image } from 'react-native'
import { observer, useDidUpdate } from 'startupjs'
import PropTypes from 'prop-types'
import randomcolor from 'randomcolor'
import Div from './../Div'
import Span from '../typography/Span'
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

  const avatarStyleForSize = typeof size === 'number'
    ? {
      width: `${size}px`,
      height: `${size}px`
    }
    : {}
  const statusStyleForSize = typeof size === 'number'
    ? {
      width: `${Math.round(size / 4)}px`,
      height: `${Math.round(size / 4)}px`
    }
    : {}

  const styleForRoot = Array.isArray(style) ? [...style, avatarStyleForSize] : { ...style, ...avatarStyleForSize }
  const _styleName = typeof size === 'string' ? [size] : []
  return pug`
    Div.root(
      style= styleForRoot
      styleName= _styleName
      ...props
    )
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
            styleName=_styleName
            style={backgroundColor: randomcolor({
              luminosity: 'bright',
              seed: _fallback
            })}
          )
            Span.fallback(styleName=_styleName bold)
              = initials
      if status
        Div.status(styleName=[status, shape, _styleName] style=statusStyleForSize)
  `
}

Avatar.defaultProps = {
  children: '?',
  size: 'm',
  shape: 'circle',
  disabled: Div.defaultProps.disabled
}

Avatar.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  src: PropTypes.string,
  size: PropTypes.oneOfType([
    PropTypes.oneOf(['l', 'm', 's']),
    PropTypes.number
  ]),
  shape: Div.propTypes.shape,
  status: PropTypes.oneOf(['online', 'away']),
  children: PropTypes.string,
  disabled: Div.propTypes.disabled,
  onPress: Div.propTypes.onPress
}

export default observer(Avatar)
