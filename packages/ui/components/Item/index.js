import React from 'react'
import { Image } from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Div from '../Div'
import Row from '../Row'
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
    Wrapper = Row
  }

  let leftPart = null
  let contentPart = []
  let rightPart = null

  React.Children.toArray(children).forEach(child => {
    if (ItemLeft === child.type) {
      leftPart = child
      return
    }

    if (ItemRight === child.type) {
      rightPart = child
      return
    }

    if (typeof child === 'string') {
      contentPart.push(pug`
        ItemContent= child
      `)
      return
    }

    contentPart.push(child)
  })

  if (icon) {
    leftPart = pug`
      ItemLeft
        Icon(icon=icon)
    `
  }

  if (url) {
    leftPart = pug`
      ItemLeft
        Image.image(source={ uri: url })
    `
  }

  return pug`
    Wrapper.root(
      style=style
      variant="highlight"
      onPress=onPress
      ...extraProps
      ...props
    )
      Row.mainPart
        = leftPart
        = contentPart
      = rightPart
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
    if typeof children === 'string'
      Span.left(style=style)= children
    else
      Div.left(style=style)= children
  `
}

function ItemContent ({ style, bold, children }) {
  return pug`
    if typeof children === 'string'
      Span.content(style=style bold=bold)= children
    else
      Div.content(style=style)= children
  `
}

function ItemRight ({ style, children }) {
  return pug`
    if typeof children === 'string'
      Span.right(style=style)= children
    else
      Div.right(style=style)= children
  `
}

ObservedItem.Left = ItemLeft
ObservedItem.Content = ItemContent
ObservedItem.Right = ItemRight

export default ObservedItem
