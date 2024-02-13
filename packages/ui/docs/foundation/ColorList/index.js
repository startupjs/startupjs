/* eslint-disable no-unreachable */
import React from 'react'
import { pug, observer, styl } from 'startupjs'
import { Br, Div, H5, Span, useColors } from '@startupjs/ui'

export default observer(function ColorList ({ items }) {
  const getColor = useColors()
  return pug`
    each item, index in items
      Div.item(key=index)
        H5(bold)= item.label
        each item, index in item.colors
          Div.card(key=index row)
            Div.left
              Div.nameWrapper
                Span.name(bold)= item.name
              Br(lines=1.5)
              Span.description= item.description
            Div.right(style={ backgroundColor: getColor(item.name) })
  `

  styl`
    .item
      margin-top 3u

    .card
      border-width 1px
      border-color var(--color-border-main)
      background-color var(--color-bg-main)
      radius(l)
      padding 3u
      margin-top 3u
      justify-content space-between

    .left
      align-items flex-start
      flex-shrink 1

    .nameWrapper
      padding 1u
      background-color var(--color-bg-main-subtle)
      radius()

    .name
    .description
      font(body2)

    .right
      height 4u
      margin-left 5u
      width 13.5u
      border-width 1px
      border-color var(--color-border-main)
      radius(l)
  `
})
