import React from 'react'
import { observer, useBind } from 'startupjs'
import PropTypes from 'prop-types'
import Div from './../Div'
import CollapseHeader from './CollapseHeader'
import CollapseContent from './CollapseContent'
import './index.styl'

// TODO: hover, active states
function Collapse ({
  style,
  children,
  title,
  open,
  $open,
  variant,
  onChange,
  ...props
}) {
  ({ open, onChange } = useBind({ $open, open, onChange }))

  // Deconstruct template variables
  let header, content
  const contentChildren = []
  React.Children.forEach(children, child => {
    switch (child && child.type) {
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
    Div.root(style=style ...extraProps ...props)
      = header
      = content
  `
}

Collapse.defaultProps = {
  open: false,
  variant: 'full'
}

Collapse.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node,
  open: PropTypes.bool,
  variant: PropTypes.oneOf(['full', 'pure']),
  onChange: PropTypes.func
}

const ObserverCollapse = observer(Collapse)
ObserverCollapse.Header = CollapseHeader
ObserverCollapse.Content = CollapseContent

export default ObserverCollapse
