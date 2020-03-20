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
}) {
  const childrenList = React.Children.toArray(children)
  const headerChildren = []
  const contentChildren = []
  childrenList.forEach(child => {
    switch (child.type) {
      case CollapseHeader:
        headerChildren.push(child)
        break
      default:
        contentChildren.push(child)
    }
  })

  const headerProps = { open, variant, onPress }
  const header = title
    ? React.createElement(CollapseHeader, headerProps, title)
    : headerChildren
      .map(child =>
        React.cloneElement(
          child,
          { ...headerProps, ...child.props }
        )
      )

  const doChildrenHaveCollapseContent =
    !!contentChildren.filter(child => child.type === CollapseContent).length

  const contentProps = { open, variant }
  const content = doChildrenHaveCollapseContent
    ? contentChildren
      .map(child => {
        const props = child.type === CollapseContent
          ? { ...contentProps, ...child.props }
          : null

        return React.cloneElement(
          child,
          props
        )
      })
    : React.createElement(CollapseContent, contentProps, contentChildren)

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
