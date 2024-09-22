import React from 'react'
import { pug, observer } from 'startupjs'
import PropTypes from 'prop-types'
import Link from './../Link'
import Div from '../Div'
import Icon from '../Icon'
import Span from '../typography/Span'
import themed from '../../theming/themed'
import useColors from '../../hooks/useColors'
import './index.styl'

const DEPRECATED_SIZE_VALUES = ['xs', 'xl', 'xxl']

function Breadcrumbs ({
  style,
  routes,
  separator,
  size,
  replace,
  iconPosition
}) {
  if (DEPRECATED_SIZE_VALUES.includes(size)) {
    console.warn(`[@startupjs/ui] Breadcrumbs: size='${size}' is DEPRECATED, use one of 's', 'm', 'l' instead.`)
  }
  const getColor = useColors()

  function renderItem ({ icon, color, bold, children }) {
    const extraStyle = { color }
    return pug`
      Div(vAlign='center' reverse=iconPosition === 'right' row)
        if icon
          Div.iconWrapper(styleName=[size, iconPosition])
            Icon(style=extraStyle icon=icon size=size)
        Span.content(
          style=extraStyle
          styleName=[size]
          bold=bold
        )= children
    `
  }

  return pug`
    Div(style=style wrap row)
      each route, index in routes
        - const { name, icon, to } = route
        - const isLastRoute = index === routes.length - 1
        React.Fragment(key=index)
          if isLastRoute
            = renderItem({ icon, color: getColor('text-secondary'), bold: true, children: name })
          else
            Div.item(row)
              Link(
                replace=replace
                to=to
              )
                = renderItem({ icon, color: getColor('text-description'), children: name })
              if typeof separator === 'string'
                Span.separator(styleName=[size])
                  | &nbsp#{separator}&nbsp
              else
                = separator
  `
}

Breadcrumbs.defaultProps = {
  routes: [],
  separator: '/',
  size: 'm',
  replace: false,
  iconPosition: 'left'
}

Breadcrumbs.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  routes: PropTypes.arrayOf(PropTypes.shape({
    to: PropTypes.string,
    name: PropTypes.string,
    icon: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
  })).isRequired,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  separator: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  size: PropTypes.oneOf(['xs', 's', 'm', 'l', 'xl', 'xxl']),
  replace: PropTypes.bool
}

export default observer(themed('Breadcrumbs', Breadcrumbs))
