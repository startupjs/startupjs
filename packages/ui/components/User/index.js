import React from 'react'
import { View } from 'react-native'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import Avatar from '../Avatar'
import Div from '../Div'
import Span from '../Span'
import './index.styl'

const nameSizes = {
  xxl: 'xl',
  xl: 'l',
  l: 'l',
  m: 'm',
  s: 'm',
  xs: 'm'
}

const descriptionSizes = {
  xxl: 'l',
  xl: 'm',
  l: 'm',
  m: 's',
  s: 'xs',
  xs: 'xs'
}

function User ({
  style,
  avatarUrl,
  description,
  name,
  avatarPosition,
  size,
  status,
  onPress
}) {
  return pug`
    Div.root(
      style=style
      styleName=[avatarPosition]
      onPress=onPress
    )
      Avatar.avatar(
        styleName=[avatarPosition]
        size=size
        status=status
        url=avatarUrl
        fallback=name
      )
      View.userInfo
        Span.name(
          styleName=[avatarPosition]
          bold
          size=nameSizes[size]
          numberOfLines=1
        )= name
        if description
          Span.description(
            size=[descriptionSizes[size]]
            styleName=[avatarPosition]
            description
          )= description
  `
}

User.defaultProps = {
  avatarPosition: 'left',
  size: 'm'
}

User.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  avatarUrl: propTypes.string,
  description: propTypes.string,
  name: propTypes.string.isRequired,
  avatarPosition: propTypes.oneOf(['left', 'right']),
  size: propTypes.oneOf(['xxl', 'xl', 'l', 'm', 's', 'xs']),
  status: propTypes.oneOf(['online', 'away']),
  onPress: propTypes.func
}

export default observer(User)
