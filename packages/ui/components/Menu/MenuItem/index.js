import React, { useContext } from 'react'
import { pug, observer } from 'startupjs'
import PropTypes from 'prop-types'
import Item from '../../Item'
import Div from '../../Div'
import Icon from '../../Icon'
import Span from '../../typography/Span'
import themed from '../../../theming/themed'
import MenuContext from '../context'
import useColors from '../../../hooks/useColors'
import './index.styl'

function MenuItem ({
  children,
  containerStyle,
  active,
  bold,
  icon,
  ...props
}) {
  const context = useContext(MenuContext)
  const getColor = useColors()

  // TODO
  // we should think about a better api
  // and remove color, activeColor, activeBorder props
  let color = props.color || context.color
  const activeColor = props.activeColor || context.activeColor
  const activeBorder = props.activeBorder || context.activeBorder || 'none'
  const iconPosition = props.iconPosition || context.iconPosition || 'left'

  // TODO: prevent click if already active (for link and for div)
  color = active ? activeColor || getColor('text-primary') : color || getColor('text-main')
  const borderStyle = { backgroundColor: activeColor || getColor('border-primary') }

  return pug`
    Div
      Item(...props)
        if icon && iconPosition === 'left'
          Item.Left
            Icon(icon=icon style={ color })

        Item.Content(style=[containerStyle])
          Span(bold=bold style={ color })= children

        if icon && iconPosition === 'right'
          Item.Right
            Icon(icon=icon style={ color })

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
