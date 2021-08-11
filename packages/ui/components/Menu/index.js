import React, { useMemo } from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Div from './../Div'
import MenuItem from './MenuItem'
import themed from '../../theming/themed'
import './index.styl'

function Menu ({ style, children, variant, activeBorder, iconPosition, activeColor }) {
  const content = useMemo(
    () =>
      React.Children.toArray(children).map(child =>
        child.type === MenuItem ||
        // INFO: specific case for mdx
        child.props?.originalType?.name === MenuItem.name
          ? React.cloneElement(child, { activeBorder, activeColor, iconPosition, ...child.props })
          : child
      ),
    [children, activeBorder, activeColor, iconPosition]
  )

  return pug`
    Div.root(style=style styleName=[variant])
      = content
  `
}

Menu.defaultProps = {
  variant: 'vertical',
  activeBorder: MenuItem.defaultProps.activeBorder,
  iconPosition: MenuItem.defaultProps.iconPosition
}

Menu.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node,
  activeBorder: MenuItem.propTypes.activeBorder,
  activeColor: MenuItem.propTypes.activeColor,
  iconPosition: MenuItem.propTypes.iconPosition,
  variant: PropTypes.oneOf(['vertical', 'horizontal'])
}

const ObservedMenu = observer(themed(Menu))

ObservedMenu.Item = MenuItem

export default ObservedMenu
