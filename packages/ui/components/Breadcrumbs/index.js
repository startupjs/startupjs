import React, { useMemo } from 'react'
import propTypes from 'prop-types'
import { observer, emit } from 'startupjs'
import { TouchableOpacity } from 'react-native'
import Row from '../Row'
import Span from '../Span'
import config from '../../config/rootConfig'

const { colors } = config

function Breadcrumbs ({
  style,
  routes,
  separator,
  size,
  color,
  textColor,
  separatorColor
}) {
  const _textColor = useMemo(() => colors[textColor] || textColor || colors[color] || color, [textColor, color])
  const _separatorColor = useMemo(() => colors[separatorColor] || separatorColor || colors[color] || color, [separatorColor, color])

  return pug`
    Row(style=style vAlign='center' wrap)
      each route, index in routes
        - const { name, icon, path } = route
        - const lastRoute = index === routes.length - 1
        Row(key=index vAlign='center')
          if index !== 0
            Span(size=size style={color: _separatorColor})
              | &nbsp#{separator}&nbsp
          TouchableOpacity(onPress=()=> path && emit('url', path))
            if icon
              = icon
            if name
              Span(
                style={color: lastRoute ? colors.mainText : _textColor}
                size=size
                bold=lastRoute
              )= name
  `
}

Breadcrumbs.defaultProps = {
  routes: [],
  separator: '/',
  size: 's',
  color: 'mainText'
}

Breadcrumbs.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  routes: propTypes.arrayOf(propTypes.shape({
    name: propTypes.string,
    icon: propTypes.object,
    path: propTypes.string
  })).isRequired,
  separator: propTypes.string,
  size: propTypes.oneOf(['xs', 's', 'm', 'l', 'xl', 'xxl']),
  color: propTypes.string,
  textColor: propTypes.string,
  separatorColor: propTypes.string
}

export default observer(Breadcrumbs)
