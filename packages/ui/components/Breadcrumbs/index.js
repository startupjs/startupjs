import React from 'react'
import propTypes from 'prop-types'
import { observer, emit } from 'startupjs'
import { TouchableOpacity } from 'react-native'
import Icon from '../Icon'
import Row from '../Row'
import Span from '../Span'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import config from '../../config/rootConfig'
import './index.styl'

const { colors } = config

function Breadcrumbs ({
  style,
  routes,
  separator,
  size,
  textColor,
  separatorColor,
  isShowHome,
  iconColor
}) {
  if (!routes.length) return null

  const _textColor = colors[textColor] || textColor
  const _separatorColor = colors[separatorColor] || separatorColor
  const _iconColor = colors[iconColor] || iconColor

  return pug`
    Row.root(style=style)
      if isShowHome
        TouchableOpacity(onPress=()=>emit('url', '/'))
          Icon(icon=faHome iconSize=size color=_iconColor)
      each route, ind in routes
        - const { name, path, disabled } = route
        Row.item(key=ind)
          if ind !== 0 || isShowHome
            if typeof separator === 'string'
              Span(size=size style={color: _separatorColor})
                | &nbsp#{separator}&nbsp
            else
              = separator
          TouchableOpacity(onPress=()=>!disabled && path && emit('url', path))
            Span(size=size style={color: _textColor})= name
  `
}

Breadcrumbs.defaultProps = {
  routes: [],
  isShowHome: true,
  separator: '>',
  size: 's',
  textColor: '#008dff',
  separatorColor: 'secondaryText',
  iconColor: 'primary'
}

Breadcrumbs.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  routes: propTypes.arrayOf(propTypes.shape({
    name: propTypes.string,
    path: propTypes.string,
    disabled: propTypes.bool
  })).isRequired,
  isShowHome: propTypes.bool,
  separator: propTypes.oneOfType([propTypes.string, propTypes.element]),
  size: propTypes.oneOf(['xxl', 'xl', 'l', 'm', 's', 'xs']),
  textColor: propTypes.string,
  separatorColor: propTypes.string,
  iconColor: propTypes.string
}

export default observer(Breadcrumbs)
