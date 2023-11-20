import React, { useMemo } from 'react'
import { pug, observer } from 'startupjs'
import PropTypes from 'prop-types'
import Div from './../Div'
import MenuItem from './MenuItem'
import themed from '../../theming/themed'
import Context from './context'
import './index.styl'

function Menu ({ style, children, variant, activeBorder, iconPosition, activeColor, ...props }) {
  const value = useMemo(() => {
    return { activeBorder, activeColor, iconPosition }
  }, [activeBorder, activeColor, iconPosition])

  return pug`
    Context.Provider(value=value)
      Div.root(
        style=style
        styleName=[variant]
        ...props
      )= children
  `
}

Menu.defaultProps = {
  ...Div.defaultProps,
  variant: 'vertical'
}

Menu.propTypes = {
  ...Div.propTypes,
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
