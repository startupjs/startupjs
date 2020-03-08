import React, { useMemo } from 'react'
import propTypes from 'prop-types'
import { observer, emit } from 'startupjs'
import { TouchableOpacity } from 'react-native'
import Row from '../Row'
import Span from '../Span'
import config from '../../config/rootConfig'
import './index.styl'

const { colors } = config

function Breadcrumb ({
  style,
  routes,
  home,
  separator,
  size,
  textColor,
  separatorColor
}) {
  if (!routes || !routes.length) return null

  const _textColor = useMemo(() => colors[textColor] || textColor, [textColor])
  const _separatorColor = useMemo(() => colors[separatorColor] || separatorColor, [separatorColor])

  return pug`
    Row.root(style=style)
      if home
        TouchableOpacity(onPress=()=>emit('url', '/'))
          if typeof home === 'string'
            Span(size=size style={color: _textColor})
              = home
          else
            = home
      each route, ind in routes
        - const { name, path } = route
        - const lastRoute = ind === routes.length - 1
        Row.item(key=ind)
          if ind !== 0 || home
            if typeof separator === 'string'
              Span(size=size style={color: _separatorColor})
                | &nbsp#{separator}&nbsp
            else
              = separator
          TouchableOpacity(onPress=()=> path && emit('url', path))
            Span(
              style={color: lastRoute ? colors.primaryText : _textColor} 
              size=size 
              bold=lastRoute
            )= name
  `
}

Breadcrumb.defaultProps = {
  home: 'Home',
  separator: '/',
  size: 's',
  textColor: 'mainText',
  separatorColor: 'mainText'
}

Breadcrumb.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  routes: propTypes.arrayOf(propTypes.shape({
    name: propTypes.string,
    path: propTypes.string
  })).isRequired,
  home: propTypes.oneOfType([propTypes.string, propTypes.element, propTypes.bool]),
  separator: propTypes.oneOfType([propTypes.string, propTypes.element]),
  size: propTypes.oneOf(['xs', 's', 'm', 'l', 'xl', 'xxl']),
  textColor: propTypes.string,
  separatorColor: propTypes.string
}

export default observer(Breadcrumb)
