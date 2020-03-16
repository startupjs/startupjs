import React, { useMemo } from 'react'
import propTypes from 'prop-types'
import { observer } from 'startupjs'
import { Link } from 'react-router-native'
import Row from '../Row'
import Span from '../Span'
import Icon from '../Icon'
import config from '../../config/rootConfig'
import './index.styl'

const { colors } = config

function Breadcrumbs ({
  style,
  routes,
  separator,
  size,
  color,
  textColor,
  separatorColor,
  iconColor
}) {
  const _color = useMemo(() => colors[color] || color, [color])
  const _textColor = useMemo(() => colors[textColor] || textColor || _color, [textColor, _color])
  const _separatorColor = useMemo(() => colors[separatorColor] || separatorColor || _color, [separatorColor, _color])
  const _iconColor = useMemo(() => colors[iconColor] || iconColor || _textColor || _color, [iconColor, _color, _textColor])

  return pug`
    Row(style=style vAlign='center' wrap)
      each route, index in routes
        - const { name, icon, ...linkProps } = route
        - const isLastRoute = index === routes.length - 1
        Row(key=index vAlign='center')
          Link.link(...linkProps)
            Row(vAlign='center')
              if icon
                Icon(icon=icon size=size color=_iconColor)
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
    icon: propTypes.object
  })).isRequired,
  separator: propTypes.string,
  size: propTypes.oneOf(['xs', 's', 'm', 'l', 'xl', 'xxl']),
  color: propTypes.string,
  textColor: propTypes.string,
  separatorColor: propTypes.string,
  iconColor: propTypes.string
}

export default observer(Breadcrumbs)
