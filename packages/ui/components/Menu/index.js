import React from 'react'
import { observer } from 'startupjs'
import Div from './../Div'
import propTypes from 'prop-types'
import MenuItem from './MenuItem'
import './index.styl'

function Menu ({
  style,
  children,
  variant,
  activeBorder
}) {
  const content = React.Children.toArray(children).map((child, index) => {
    const key = `__MENUITEM_CONTENT_KEY_${index}__`
    return React.cloneElement(child, { key, activeBorder })
  })

  return pug`
    Div.root(style=style styleName=[variant])
      = content
  `
}

Menu.defaultProps = {
  variant: 'vertical',
  activeBorder: 'none'
}

Menu.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  variant: propTypes.oneOf(['vertical', 'horizontal']),
  activeBorder: propTypes.oneOf(['top', 'bottom', 'left', 'right', 'none'])
}

const ObservedMenu = observer(Menu)
ObservedMenu.Item = MenuItem
export default ObservedMenu
