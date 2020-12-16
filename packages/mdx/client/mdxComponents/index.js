import React, { useState, useContext } from 'react'
import { Platform } from 'react-native'
import { $root } from 'startupjs'
import {
  Div,
  H2,
  H5,
  H6,
  Divider,
  Span,
  Br,
  Row,
  Link,
  Icon
} from '@startupjs/ui'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import './index.styl'
import Code from '../Code'

const isWeb = Platform.OS === 'web'
const ALPHABET = 'abcdefghigklmnopqrstuvwxyz'
const ListLevelContext = React.createContext()

function getOrderedListMark (index, level) {
  switch (level) {
    case 1:
      return ALPHABET.charAt(index % ALPHABET.length) + ')'
    default:
      return '' + (index + 1) + '.'
  }
}

function P ({ children }) {
  return pug`
    Span.p= children
  `
}

function Anchor ({
  style,
  children,
  anchor,
  size
}) {
  if (!isWeb) {
    return pug`
      Div(style=style)= children
    `
  }

  /// HACK TODO
  /// This is a hack that fixes invalid URLs for anchors.
  /// Remove this hack when there is a mdxComponent refactor.
  const getChildrenOfAnchor = obj => {
    const getProp = o => {
      for (let prop in o) {
        if (prop === 'props') {
          if (typeof (o[prop].children) === 'object') {
            getProp(o[prop].children)
          } else {
            anchor = o[prop].children
          }
        }
      }
    }

    if (Array.isArray(obj)) {
      obj = obj[0]
    }

    getProp(obj)
  }

  if (typeof anchor === 'object') {
    getChildrenOfAnchor(anchor)
  }

  const [hover, setHover] = useState()

  return pug`
    Row.anchor(
      style=style
      onLayout=(e) => {
        $root.set('_session.anchors.' + anchor, e.nativeEvent.layout.y)
      }
      vAlign='center'
      onMouseEnter=() => setHover(true)
      onMouseLeave=() => setHover()
    )
      = children
      Link.anchor-link(
        styleName={ hover }
        to='#' + anchor
      )
        Icon(icon=faLink size=size)
  `
}

export default {
  wrapper: ({ children }) => pug`
    Div= children
  `,
  section: ({ children }) => pug`
    Div.example= children
  `,
  h1: ({ children }) => pug`
    Anchor(anchor=children size='xl')
      H2(bold)
        = children
  `,
  h2: ({ children }) => pug`
    Anchor.h2(anchor=children)
      H5.h2-text= children
    Div.divider
  `,
  h3: ({ children }) => pug`
    Anchor.h6(anchor=children size='s')
      H6(bold)= children
  `,
  p: P,
  strong: ({ children }) => pug`
    Span.p(bold)= children
  `,
  em: ({ children }) => pug`
    Span.p(italic)= children
  `,
  pre: ({ children }) => children,
  code: ({ children, className }) => {
    const language = (className || '').replace(/language-/, '')
    return pug`
      Br
      Code(language=language)= children
    `
  },
  inlineCode: ({ children }) => pug`
    Span.inlineCode(
      style={
        fontFamily: Platform.OS === 'ios' ? 'Menlo-Regular' : 'monospace'
      }
    )= ' ' + children + ' '
  `,
  hr: ({ children }) => pug`
    Divider(size='l')
  `,
  // TODO: https://mdxjs.com/getting-started#table-of-components
  //       Mock everything as P for now.
  h4: P,
  h5: P,
  h6: P,
  thematicBreak: P,
  blockquote: P,
  ul: ({ children }) => children,
  ol: ({ children }) => {
    const currentLevel = useContext(ListLevelContext)
    const nextLevel = currentLevel == null ? 0 : currentLevel + 1
    return pug`
      ListLevelContext.Provider(value=nextLevel)
        = React.Children.map(children, (child, index) => React.cloneElement(child, { index }))
    `
  },
  li: ({ children, index }) => {
    const level = useContext(ListLevelContext)
    let hasTextChild = false
    children = React.Children.map(children, child => {
      if (typeof child === 'string') {
        hasTextChild = true
      }
      return child
    })
    return pug`
      Row
        Span.listIndex= index == null ? '•' : getOrderedListMark(index, level)
        Div.listContent
          if hasTextChild
            P(size='l')= children
          else
            = children
    `
  },
  table: P,
  thead: P,
  tbody: P,
  tr: P,
  td: P,
  th: P,
  delete: P,
  a: ({ children, href }) => {
    return pug`
      Link.link(to=href size='l' color='primary')= children
    `
  },
  img: P
}
