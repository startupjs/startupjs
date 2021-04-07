import React, { useState } from 'react'
import { Image } from 'react-native'
import { observer, useDidUpdate } from 'startupjs'
import Div from './../Div'
import PropTypes from 'prop-types'
import randomcolor from 'randomcolor'
import Span from '../typography/Span'
import './index.styl'

function Avatar ({
  style,
  src,
  size,
  status,
  shape,
  children,
  renderStatus,
  ...props
}) {
  const [error, setError] = useState()
  useDidUpdate(setError, [src])

  function _renderStatus () {
    if (!renderStatus && !status) return null
    if (renderStatus) {
      return pug`
        = renderStatus(size, shape)
      `
    }
    return pug`
      Div.status(styleName=[size, status, shape])
    `
  }

  return pug`
    Div.root(style=style styleName=[size] ...props)
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
            Span.fallback(styleName=[size] bold)
              = initials

      = _renderStatus()
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
  size: PropTypes.oneOf(['xxl', 'xl', 'l', 'm', 's', 'xs']),
  shape: Div.propTypes.shape,
  status: PropTypes.oneOf(['online', 'away']),
  children: PropTypes.string,
  disabled: Div.propTypes.disabled,
  onPress: Div.propTypes.onPress,
  renderStatus: PropTypes.func
}

export default observer(Avatar)
