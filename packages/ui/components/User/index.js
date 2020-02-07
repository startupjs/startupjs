import React from 'react'
import { View } from 'react-native'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import Avatar from '../Avatar'
import Div from '../Div'
import Span from '../Span'
import './index.styl'

const descriptionSizes = {
  xxl: 'l',
  xl: 'm',
  l: 's',
  m: 'xs',
  s: 'xs',
  xs: 'xs'
}

function User ({
  avatarUrl,
  backgroundColor,
  description,
  name,
  online,
  position,
  size,
  onPress
}) {
  return pug`
    Div.root(
      styleName=[position]
      backgroundColor=backgroundColor
      onPress=onPress
    )
      View.avatar(styleName=[position])
        Avatar(size=size url=avatarUrl fallback=name)
        if online
          StatusLabel.statusLabel(styleName=[size])
      View.textWrapper
        View.nameWrapper(styleName=[position])
          Span.name(size=size styleName=[position])= name
        View.descriptionWrapper(styleName=[position])
          Span.description(
            size=descriptionSizes[size]
            styleName=[position]
            description
          )= description
  `
}

function StatusLabel ({ style }) {
  return pug`
    Div(style=style)
  `
}

User.defaultProps = {
  position: 'right',
  size: 'm'
}

User.propTypes = {
  avatarUrl: propTypes.string,
  description: propTypes.string,
  name: propTypes.string,
  online: propTypes.bool,
  position: propTypes.oneOf(['left', 'right']),
  size: propTypes.oneOf(['xxl', 'xl', 'l', 'm', 's', 'xs']),
  onPress: propTypes.func
}

export default observer(User)
