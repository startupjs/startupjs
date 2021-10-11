import React, { useContext } from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Div from '../Div'
import Link from '../Link'
import Icon from '../Icon'
import Span from '../typography/Span'
import themed from '../../theming/themed'
import ListContext from '../List/context'
import STYLES from './index.styl'

const { colors } = STYLES

function Item ({
  style,
  containerStyle,
  children,
  to,
  active,
  bold,
  icon,
  onPress,
  ...props
}) {
  const context = useContext(ListContext)

  const activeColor = props.activeColor || context.activeColor
  const activeBorder = props.activeBorder || context.activeBorder
  const iconPosition = props.iconPosition || context.iconPosition

  // TODO: prevent click if already active (for link and for div)
  const activeItemColor = activeColor || colors.primary
  const color = active ? activeItemColor : colors.mainText
  const borderStyle = { backgroundColor: activeItemColor }
  const extraProps = {}
  const reverse = iconPosition === 'right'
  let Wrapper

  if (to) {
    Wrapper = Link
    extraProps.to = to
    extraProps.block = true
  } else {
    Wrapper = Div
  }

  return pug`
    Wrapper.root(
      style=style
      styleName={reverse}
      variant='highlight'
      onPress=onPress
      ...extraProps
      ...props
    )
      if activeBorder !== 'none' && active
        Div.border(styleName=[activeBorder] style=borderStyle)
      if icon
        Icon.icon(styleName=[iconPosition] icon=icon style={color})

      Div.container(style=containerStyle)
        if typeof children === 'string'
          Span(style={color} bold=bold numberOfLines=1)= children
        else
          = children
  `
}

Item.defaultProps = {
  active: false
}

Item.propTypes = {
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

export default observer(themed('Item', Item))
