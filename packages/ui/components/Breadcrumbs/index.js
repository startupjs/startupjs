import React from 'react'
import propTypes from 'prop-types'
import { observer } from 'startupjs'
import Link from './../Link'
import Row from '../Row'
import Span from '../Span'
import './index.styl'

function Breadcrumbs ({
  style,
  routes,
  separator,
  size,
  replace,
  disabled
}) {
  return pug`
    Row(style=style wrap)
      each route, index in routes
        - const { name, icon, ...linkProps } = route
        - const isLastRoute = index === routes.length - 1
        Row(key=index)
          Link(
            icon=icon
            size=size
            bold=isLastRoute
            replace=replace
            disabled=disabled
            ...linkProps
          )= name
          if !isLastRoute
            Span.separator(size=size)
              | &nbsp#{separator}&nbsp
  `
}

Breadcrumbs.defaultProps = {
  routes: [],
  separator: '/',
  size: 'm',
  replace: false,
  disabled: false
}

Breadcrumbs.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  routes: propTypes.arrayOf(propTypes.shape({
    to: propTypes.string,
    name: propTypes.string,
    icon: propTypes.object
  })).isRequired,
  separator: propTypes.string,
  size: propTypes.oneOf(['xs', 's', 'm', 'l', 'xl', 'xxl']),
  replace: propTypes.bool,
  disabled: propTypes.bool
}

export default observer(Breadcrumbs)
