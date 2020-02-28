import React from 'react'
import propTypes from 'prop-types'
import { observer } from 'startupjs'
import { View } from 'react-native'
import Div from './../Div'
import Collapsible from 'react-native-collapsible'
import CollapseTitle from './CollapseTitle'
import config from '../../config/rootConfig'
import './index.styl'

const { colors } = config

// TODO: hover, active states
function Collapse ({ style, children, open, variant, onChange }) {
  const childrenList = React.Children.toArray(children)
  const content = childrenList.filter(child => child.type !== CollapseTitle)
  const title =
    childrenList
      .filter(child => child.type === CollapseTitle)
      .map(child => React.cloneElement(child, { open, variant, onPress }))

  const collapsed = !open
  function onPress () {
    onChange && onChange(collapsed)
  }

  const extraProps = {}
  const extraStyles = {}
  if (variant === 'full') {
    extraProps.level = 1
    extraStyles.backgroundColor = colors.white
  }

  return pug`
    Div.root(style=style ...extraProps)
      = title
      Collapsible(collapsed=collapsed)
        View.content(styleName=[variant])= content
  `
}

Collapse.defaultProps = {
  open: false,
  variant: 'full'
}

Collapse.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  open: propTypes.bool,
  variant: propTypes.oneOf(['full', 'compact'])
}

const ObserverCollapse = observer(Collapse)
ObserverCollapse.Title = CollapseTitle

export default ObserverCollapse
