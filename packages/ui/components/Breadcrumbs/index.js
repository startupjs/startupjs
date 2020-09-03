import React from 'react'
import propTypes from 'prop-types'
import { observer } from 'startupjs'
import Link from './../Link'
import Row from '../Row'
import Div from '../Div'
import Icon from '../Icon'
import Span from '../typography/Span'
import { colorToRGBA } from '../../config/helpers'
import STYLES from './index.styl'

const { colors } = STYLES
const mainTextColor = colors.mainText

function Breadcrumbs ({
  style,
  routes,
  separator,
  size,
  replace,
  iconPosition
}) {
  function Item ({ icon, color, bold, children }) {
    const extraStyle = { color }
    return pug`
      Row(vAlign='center' reverse=iconPosition === 'right')
        if icon
          Div.iconWrapper(styleName=[size, iconPosition])
            Icon(style=extraStyle icon=icon size=size)
        Span.content(
          style=extraStyle
          size=size
          bold=bold
        )= children
    `
  }

  return pug`
    Row(style=style wrap)
      each route, index in routes
        - const { name, icon, ...linkProps } = route
        - const isLastRoute = index === routes.length - 1
        React.Fragment(key=index)
          if isLastRoute
            Item(icon=icon color=mainTextColor bold)= name
          else
            Row
              Link(
                block
                replace=replace
                ...linkProps
              )
                Item(icon=icon color=colorToRGBA(mainTextColor, 0.8))= name
              Span.separator(size=size)
                | &nbsp#{separator}&nbsp
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
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  routes: propTypes.arrayOf(propTypes.shape({
    to: propTypes.string,
    name: propTypes.string,
    icon: propTypes.object
  })).isRequired,
  iconPosition: propTypes.oneOf(['left', 'right']),
  separator: propTypes.string,
  size: propTypes.oneOf(['xs', 's', 'm', 'l', 'xl', 'xxl']),
  replace: propTypes.bool
}

export default observer(Breadcrumbs)
