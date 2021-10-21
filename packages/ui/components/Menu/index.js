import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Div from './../Div'
import MenuItem from './MenuItem'
import themed from '../../theming/themed'
import Context from './context'
import './index.styl'

function Menu ({ style, children, variant, activeBorder, iconPosition, activeColor }) {
  return pug`
    Context.Provider(value={ activeBorder, activeColor, iconPosition })
      Div.root(
        style=style
        styleName=[variant]
      )= children
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
  activeBorder: MenuItem.propTypes.activeBorder,
  activeColor: MenuItem.propTypes.activeColor,
  iconPosition: MenuItem.propTypes.iconPosition,
  variant: PropTypes.oneOf(['vertical', 'horizontal'])
}

const ObservedMenu = observer(themed('Menu', Menu))

ObservedMenu.Item = MenuItem

export default ObservedMenu
