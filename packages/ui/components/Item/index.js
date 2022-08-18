import React from 'react'
import { Image } from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Div from '../Div'
import Link from '../Link'
import Icon from '../Icon'
import Span from '../typography/Span'
import themed from '../../theming/themed'
import './index.styl'

function Item ({
  style,
  children,
  to,
  url,
  icon,
  onPress,
  ...props
}) {
  let Wrapper
  const extraProps = {}

  if (to) {
    Wrapper = Link
    extraProps.to = to
    extraProps.block = true
  } else {
    Wrapper = Div
  }

  let left = null; let content = null; let right = null
  let contentChildren = []

  React.Children.toArray(children).forEach(child => {
    if (ItemLeft === child.type) {
      left = child
      return
    }

    if (ItemRight === child.type) {
      right = child
      return
    }

    if (ItemContent === child.type) {
      content = child
      return
    }

    contentChildren.push(child)
  })

  if (!left) {
    if (icon) {
      left = pug`
        ItemLeft
          Icon(icon=icon)
      `
    } else if (url) {
      left = pug`
        ItemLeft
          Image.image(source={ uri: url })
      `
    }
  }

  content = content ||
    (contentChildren.length === 1
      ? pug`
        ItemContent= contentChildren[0]
      `
      : pug`
        ItemContent= contentChildren
      `
    )

  return pug`
    Wrapper.root(
      style=style
      variant="highlight"
      onPress=onPress
      ...extraProps
      ...props
    )
      = left
      = content
      = right
  `
}

Item.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node,
  to: PropTypes.string,
  url: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onPress: PropTypes.func
}

const ObservedItem = observer(themed('Item', Item))

function ItemLeft ({ style, children }) {
  return pug`
    Div.left(style=style)= children
  `
}

function ItemContent ({ style, children }) {
  return pug`
    if typeof children === 'string'
      Span.content(style=style numberOfLines=1)= children
    else
      Div.content(style=style)= children
  `
}

function ItemRight ({ style, children }) {
  return pug`
    Div.right(style=style)= children
  `
}

ObservedItem.Left = ItemLeft
ObservedItem.Content = ItemContent
ObservedItem.Right = ItemRight

export default ObservedItem
