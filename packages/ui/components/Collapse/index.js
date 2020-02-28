import React from 'react'
import propTypes from 'prop-types'
import { observer } from 'startupjs'
import Div from './../Div'
import CollapseHeader from './CollapseHeader'
import CollapseContent from './CollapseContent'
import config from '../../config/rootConfig'
import './index.styl'

const { colors } = config

// TODO: hover, active states
function Collapse ({ style, children, open, variant, onChange }) {
  const childrenList = React.Children.toArray(children)

  const header =
    childrenList
      .filter(child => child.type === CollapseHeader)
      .map(child => React.cloneElement(child, { open, variant, onPress }))

  const content =
    childrenList
      .filter(child => child.type === CollapseContent)
      .map(child => React.cloneElement(child, { open, variant }))

  function onPress () {
    onChange && onChange(!open)
  }

  const extraProps = {}
  const extraStyles = {}
  if (variant === 'full') {
    extraProps.level = 1
    extraStyles.backgroundColor = colors.white
  }

  return pug`
    Div.root(style=style ...extraProps)
      = header
      = content
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
  variant: propTypes.oneOf(['full', 'pure'])
}

const ObserverCollapse = observer(Collapse)
ObserverCollapse.Header = CollapseHeader
ObserverCollapse.Content = CollapseContent

export default ObserverCollapse
