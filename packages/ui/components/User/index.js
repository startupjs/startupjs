import React from 'react'
import { View } from 'react-native'
import { pug, observer } from 'startupjs'
import PropTypes from 'prop-types'
import Avatar from '../Avatar'
import Div from '../Div'
import Span from '../typography/Span'
import themed from '../../theming/themed'
import './index.styl'

function User ({
  style,
  nameStyle,
  descriptionStyle,
  avatarUrl,
  description,
  descriptionNumberOfLines,
  name,
  avatarPosition,
  size,
  status,
  statusComponents,
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
        statusComponents=statusComponents
      )= name
      View.userInfo
        Span.name(
          style=nameStyle
          styleName=[size, avatarPosition]
          numberOfLines=1
          bold
        )= name
        if description
          Span.description(
            style=descriptionStyle
            styleName=[size, avatarPosition]
            numberOfLines=descriptionNumberOfLines
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
  nameStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  descriptionStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  avatarUrl: PropTypes.string,
  description: PropTypes.string,
  name: PropTypes.string,
  avatarPosition: PropTypes.oneOf(['left', 'right']),
  size: PropTypes.oneOf(['s', 'm', 'l']),
  status: PropTypes.oneOfType([
    PropTypes.oneOf(['online', 'away']),
    PropTypes.string
  ]),
  onPress: PropTypes.func
}

export default observer(themed('User', User))
