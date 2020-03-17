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
function Collapse ({
  style,
  children,
  title,
  open,
  variant,
  onChange
}, ref) {
  const childrenList = React.Children.toArray(children)
  const headerChilds = []
  const contentChilds = []
  childrenList.forEach(child => {
    switch (child.type) {
      case CollapseHeader:
        headerChilds.push(child)
        break
      default:
        contentChilds.push(child)
    }
  })

  const headerProps = { open, variant, onPress }
  const header = title
    ? React.createElement(CollapseHeader, headerProps, title)
    : headerChilds
      .map(child =>
        React.cloneElement(
          child,
          { ...headerProps, ...child.props }
        )
      )

  const areChildsHaveCollapseContent =
    !!contentChilds.filter(child => child.type === CollapseContent).length

  const content = areChildsHaveCollapseContent
    ? contentChilds
    : React.createElement(CollapseContent, { open, variant }, contentChilds)

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
