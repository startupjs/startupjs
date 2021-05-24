import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Div from './../Div'
import MenuItem from './MenuItem'
import { MenuProvider } from './menuContext'
import themed from '../../theming/themed'
import './index.styl'

function Menu ({
  style,
  children,
  variant,
  activeBorder,
  iconPosition,
  activeColor
}) {
  const content = React.Children.toArray(children).map((child, index) => {
    if (child.type === MenuItem) {
      return React.cloneElement(child, { activeBorder, iconPosition, activeColor })
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
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node,
  variant: PropTypes.oneOf(['vertical', 'horizontal']),
  activeBorder: PropTypes.oneOf(['top', 'bottom', 'left', 'right', 'none']),
  iconPosition: MenuItem.propTypes.iconPosition,
  activeColor: PropTypes.string
}

const ObservedMenu = observer(themed(Menu))

ObservedMenu.Item = MenuItem

export default ObservedMenu
