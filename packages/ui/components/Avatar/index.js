import React, { useState } from 'react'
import { Image, StyleSheet } from 'react-native'
import { observer, useDidUpdate } from 'startupjs'
import PropTypes from 'prop-types'
import randomcolor from 'randomcolor'
import Div from './../Div'
import Span from '../typography/Span'
import themed from '../../theming/themed'
import STYLES from './index.styl'

const { config } = STYLES

const DEFAULT_STATUSES = ['online', 'away']

function Avatar ({
  style,
  src,
  size,
  status,
  shape,
  children,
  statusComponents,
  ...props
}) {
  const [error, setError] = useState()
  useDidUpdate(setError, [src])

  const _size = config.avatarSizes[size] || size
  const rootStyle = { width: _size, height: _size }
  const _statusSize = config.statusSizes[size] || Math.round(size / 4)
  const statusStyle = { width: _statusSize, height: _statusSize }
  const _fallbackFontSize = config.fallbackSizes[size] || Math.round(size / 2.5)
  const fallbackStyle = { fontSize: _fallbackFontSize, lineHeight: _fallbackFontSize }

  const StatusComponent = getStatusComponent(statusComponents, status)

  return pug`
    Div.root(
      style=StyleSheet.flatten([style, rootStyle])
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
            style={backgroundColor: randomcolor({
              luminosity: 'bright',
              seed: _fallback
            })}
          )
            Span.fallback(bold style=fallbackStyle)
              = initials
      if status
        StatusComponent.status(styleName=[status, shape] style=statusStyle)
  `
}

function getStatusComponent (statusComponents, status) {
  if (status && !DEFAULT_STATUSES.includes(status) && !statusComponents?.[status]) {
    console.error(
      "[@dmapper/ui -> Avatar] Custom component for status '" +
        status +
        "' is not specified. Use 'statusComponents' to specify it."
    )
  }
  return statusComponents?.[status] || Div
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
    PropTypes.oneOf(['s', 'm', 'l']),
    PropTypes.number
  ]),
  shape: Div.propTypes.shape,
  status: PropTypes.oneOfType([
    PropTypes.oneOf(['online', 'away']),
    PropTypes.string
  ]),
  children: PropTypes.string,
  disabled: Div.propTypes.disabled,
  onPress: Div.propTypes.onPress
}

export default observer(themed('Avatar', Avatar))
