import React from 'react'
import propTypes from 'prop-types'
import { observer } from 'startupjs'
import Link from './../Link'
import Row from '../Row'
import Span from '../Span'
import config from '../../config/rootConfig'
import { colorToRGBA } from '../../config/helpers'
import './index.styl'

const { colors } = config
const mainTextColor = colors.mainText

function Breadcrumbs ({
  style,
  routes,
  separator,
  size,
  replace,
  disabled,
  iconPosition
}) {
  const color = disabled
    ? colorToRGBA(mainTextColor, 0.8)
    : undefined

  return pug`
    Row(style=style wrap)
      each route, index in routes
        - const { name, ...linkProps } = route
        - const isLastRoute = index === routes.length - 1
        Row(key=index)
          Link(
            color=isLastRoute ? mainTextColor: color
            iconPosition=iconPosition
            size=size
            bold=isLastRoute
            replace=replace
            disabled=disabled || isLastRoute
            ...linkProps
          )= name
          if !isLastRoute
            Span.separator(size=size styleName=[size])
              | &nbsp#{separator}&nbsp
  `
}

Breadcrumbs.defaultProps = {
  routes: [],
  separator: '/',
  size: 'm',
  replace: false,
  disabled: false,
  iconPosition: 'left'
}

Breadcrumbs.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  routes: propTypes.arrayOf(propTypes.shape({
    to: propTypes.string,
    name: propTypes.string,
    icon: propTypes.object,
    iconPosition: propTypes.oneOf(['left', 'right'])
  })).isRequired,
  iconPosition: propTypes.oneOf(['left', 'right']),
  separator: propTypes.string,
  size: propTypes.oneOf(['xs', 's', 'm', 'l', 'xl', 'xxl']),
  replace: propTypes.bool,
  disabled: propTypes.bool
}

export default observer(Breadcrumbs)
