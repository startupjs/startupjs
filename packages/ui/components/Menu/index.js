import React from 'react'
import { observer } from 'startupjs'
import Div from './../Div'
import propTypes from 'prop-types'
import MenuItem from './MenuItem'
import { MenuProvider } from './menuContext'
import './index.styl'

function Menu ({
  style,
  children,
  variant,
  activeBorder,
  iconPosition
}) {
  const content = React.Children.map(children, (child, index) => {
    if (child.type === MenuItem) {
      return React.cloneElement(child, { activeBorder })
    }
    return child
  })

  return pug`
    MenuProvider(value={iconPosition})
      Div.root(style=style styleName=[variant])
        = content
  `
}

Menu.defaultProps = {
  variant: 'vertical',
  activeBorder: 'none',
  iconPosition: 'left'
}

Menu.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  variant: propTypes.oneOf(['vertical', 'horizontal']),
  activeBorder: propTypes.oneOf(['top', 'bottom', 'left', 'right', 'none']),
  iconPosition: MenuItem.propTypes.iconPosition
}

const ObservedMenu = observer(Menu)
ObservedMenu.Item = MenuItem
export default ObservedMenu
