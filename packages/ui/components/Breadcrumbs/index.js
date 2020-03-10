import React, { useMemo } from 'react'
import propTypes from 'prop-types'
import { observer, emit } from 'startupjs'
import Row from '../Row'
import Span from '../Span'
import Icon from '../Icon'
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
  const _color = useMemo(() => colors[color] || color, [color])
  const _textColor = useMemo(() => colors[textColor] || textColor || _color, [textColor, _color])
  const _separatorColor = useMemo(() => colors[separatorColor] || separatorColor || _color, [separatorColor, _color])

  return pug`
    Row(style=style vAlign='center' wrap)
      each route, index in routes
        - const { name, icon, path } = route
        - const isLastRoute = index === routes.length - 1
        Row(key=index vAlign='center')
          Row(vAlign='center' onPress=()=> path && emit('url', path))
            if icon
              Icon(icon=icon size=size color=_textColor)
            if name
              Span(
                style={color: isLastRoute ? colors.mainText : _textColor}
                size=size
                bold=isLastRoute
              )= name
          if !isLastRoute
            Span(size=size style={color: _separatorColor})
              | &nbsp#{separator}&nbsp
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
