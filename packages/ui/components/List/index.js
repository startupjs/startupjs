import React from 'react'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Div from './../Div'
import Item from '../Item'
import themed from '../../theming/themed'
import Context from './context'
import './index.styl'

function List ({ style, children, variant, activeBorder, iconPosition, activeColor }) {
  return pug`
    Context.Provider(value={ activeBorder, activeColor, iconPosition })
      Div(
        style=style
        styleName=['root', variant]
      )= children
  `
}

List.defaultProps = {
  variant: 'vertical',
  activeBorder: 'none',
  iconPosition: 'left'
}

List.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node,
  activeBorder: Item.propTypes.activeBorder,
  activeColor: Item.propTypes.activeColor,
  iconPosition: Item.propTypes.iconPosition,
  variant: PropTypes.oneOf(['vertical', 'horizontal'])
}

const ObservedList = observer(themed('List', List))

export default ObservedList
