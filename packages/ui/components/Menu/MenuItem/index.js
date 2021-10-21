import React, { useContext } from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Item from '../../Item'
import Div from '../../Div'
import Icon from '../../Icon'
import themed from '../../../theming/themed'
import MenuContext from '../context'
import STYLES from './index.styl'

const { colors } = STYLES

function MenuItem ({
  children,
  containerStyle,
  active,
  bold,
  icon,
  ...props
}) {
  const context = useContext(MenuContext)

  const activeColor = props.activeColor || context.activeColor
  const activeBorder = props.activeBorder || context.activeBorder
  const iconPosition = props.iconPosition || context.iconPosition

  // TODO: prevent click if already active (for link and for div)
  const activeItemColor = activeColor || colors.primary
  const color = active ? activeItemColor : colors.mainText
  const borderStyle = { backgroundColor: activeItemColor }

  return pug`
    Div
      Item(...props)
        Item.Content(
          bold=bold
          style=[containerStyle, { color }]
        )= children

        if icon && iconPosition === 'right'
          Item.Right
            Icon(icon=icon styleName={ color })

      if activeBorder !== 'none' && active
        Div.border(styleName=[activeBorder] style=borderStyle)
  `
}

MenuItem.defaultProps = {
  active: false
}

MenuItem.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node,
  active: PropTypes.bool,
  activeBorder: PropTypes.oneOf(['top', 'bottom', 'left', 'right', 'none']),
  activeColor: PropTypes.string,
  bold: PropTypes.bool,
  icon: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  iconPosition: PropTypes.oneOf(['left', 'right']),
  to: PropTypes.string,
  onPress: PropTypes.func
}

export default observer(themed('MenuItem', MenuItem))
