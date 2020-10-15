import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import { View } from 'react-native'
import Avatar from '../Avatar'
import Div from '../Div'
import Span from '../typography/Span'
import './index.styl'

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
        src=avatarUrl
      )= name
      View.userInfo
        Span.name(
          styleName=[size, avatarPosition]
          numberOfLines=1
          bold
        )= name
        if description
          Span.description(
            styleName=[size, avatarPosition]
            description
          )= description
  `
}

User.defaultProps = {
  avatarPosition: 'left',
  size: 'm'
}

User.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  avatarUrl: PropTypes.string,
  description: PropTypes.string,
  name: PropTypes.string,
  avatarPosition: PropTypes.oneOf(['left', 'right']),
  size: PropTypes.oneOf(['xxl', 'xl', 'l', 'm', 's', 'xs']),
  status: PropTypes.oneOf(['online', 'away']),
  onPress: PropTypes.func
}

export default observer(User)
