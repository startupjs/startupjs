import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import Div from './../../Div'
import Span from './../../Typography/Span'
import config from '../../../config/rootConfig'
import './index.styl'

const { colors } = config

function MenuItem ({
  style,
  containerStyle,
  children,
  active,
  activeBorder,
  onPress,
  ...props
}) {
  const color = active ? colors.primary : colors.mainText

  return pug`
    Div.root(
      style=style
      variant='highlight'
      vAlign='center'
      hoverOpacity=0.05
      activeOpacity=0.25
      underlayColor=colors.primary
      onPress=onPress
      ...props
    )
      if activeBorder !== 'none' && active
        Div.border(styleName=[activeBorder])
      if typeof children === 'string'
        Span(style={color})= children
      else
        = children

  `
}

MenuItem.defaultProps = {
  active: false
}

MenuItem.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  active: propTypes.bool,
  onPress: propTypes.func
}

export default observer(MenuItem)
