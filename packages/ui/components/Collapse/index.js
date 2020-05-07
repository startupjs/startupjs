import React from 'react'
import propTypes from 'prop-types'
import { observer } from 'startupjs'
import Div from './../Div'
import CollapseHeader from './CollapseHeader'
import CollapseContent from './CollapseContent'
import { useBindingProps } from '../../hooks'
import './index.styl'

// TODO: hover, active states
function Collapse ({
  style,
  children,
  title,
  open,
  $open,
  variant,
  onChange
}) {
  ({ open, onChange } = useBindingProps($open, { open }, { onChange }))

  // Deconstruct template variables
  let header, content
  const contentChildren = []
  React.Children.forEach(children, child => {
    switch (child.type) {
      case CollapseHeader:
        if (header) throw Error('[ui -> Collapse] You must specify a single <Collapse.Header>')
        header = child
        break
      case CollapseContent:
        if (content) throw Error('[ui -> Collapse] You must specify a single <Collapse.Content>')
        content = child
        break
      default:
        contentChildren.push(child)
    }
  })
  if (content && contentChildren.length > 0) {
    throw Error('[ui -> Collapse] React elements found directly within <Collapse>. ' +
      'If <Collapse.Content> is specified, you have to put all your content inside it')
  }

  // Handle <Collapse.Content>
  const contentProps = { open, variant }
  content = content
    ? React.cloneElement(content, { ...contentProps, ...content.props })
    : React.createElement(CollapseContent, contentProps, contentChildren)

  // Handle <Collapse.Header>
  const headerProps = { open, variant, onPress }
  header = header
    ? React.cloneElement(header, { ...headerProps, ...header.props })
    : React.createElement(CollapseHeader, headerProps, title || '')

  function onPress () {
    onChange && onChange(!open)
  }

  const extraProps = {}
  if (variant === 'full') {
    extraProps.level = 1
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
  variant: propTypes.oneOf(['full', 'pure']),
  onChange: propTypes.func
}

const ObserverCollapse = observer(Collapse)
ObserverCollapse.Header = CollapseHeader
ObserverCollapse.Content = CollapseContent

export default ObserverCollapse
