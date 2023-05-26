import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import colorToRGBA from '../../helpers/colorToRGBA'
import Link from './../Link'
import Row from '../Row'
import Div from '../Div'
import Icon from '../Icon'
import Span from '../typography/Span'
import themed from '../../theming/themed'
import STYLES from './index.styl'

const { colors } = STYLES
const mainTextColor = colors.mainText

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

  function Item ({ icon, color, bold, children }) {
    const extraStyle = { color }
    return pug`
      Row(vAlign='center' reverse=iconPosition === 'right')
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
    Row(style=style wrap)
      each route, index in routes
        - const { name, icon, to } = route
        - const isLastRoute = index === routes.length - 1
        React.Fragment(key=index)
          if isLastRoute
            Item(icon=icon color=mainTextColor bold)= name
          else
            Row.item
              Link(
                replace=replace
                to=to
              )
                Item(icon=icon color=colorToRGBA(mainTextColor, 0.8))= name
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
