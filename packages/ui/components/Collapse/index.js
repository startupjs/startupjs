import React, { useMemo } from 'react'
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

  const header = title
    ? React.createElement(CollapseHeader, { open, variant, onPress }, title)
    : childrenList
      .filter(child => child.type === CollapseHeader)
      .map(child =>
        React.cloneElement(
          child,
          {
            open,
            variant: child.props.variant || variant,
            onPress
          }
        )
      )

  const contentChilds =
    useMemo(() => {
      return childrenList.filter(child => child.type !== CollapseHeader)
    }, [childrenList.length])

  const areChildsHaveCollapseContent =
    useMemo(() => {
      return !!contentChilds.filter(child => child.type === CollapseContent).length
    }, [contentChilds.length])

  const content = areChildsHaveCollapseContent
    ? contentChilds
      .map(child => {
        const props = child.type === CollapseContent
          ? { open, variant: child.props.variant || variant }
          : null

        return React.cloneElement(
          child,
          props
        )
      })
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
