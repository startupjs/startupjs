import React, { useContext } from 'react'
import { Platform } from 'react-native'
import { Div, H2, H5, H6, Divider, Span, Br, Row, Link } from '@startupjs/ui'
import './index.styl'
import Code from '../Code'

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

export default {
  wrapper: ({ children }) => pug`
    Div= children
  `,
  section: ({ children }) => pug`
    Div.example= children
  `,
  h1: ({ children }) => pug`
    H2(bold)= children
  `,
  h2: ({ children }) => pug`
    H5.h2= children
    Divider(size='l')
  `,
  h3: ({ children }) => pug`
    H6.h6(bold)= children
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
    Span.inlineCode
      Span.inlineCode-space= ' '
      Span.inlineCode-code(
        style={
          fontFamily: Platform.OS === 'ios' ? 'Menlo-Regular' : 'monospace'
        }
      )= children
      Span.inlineCode-space= ' '
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
      Link(to=href size='l' color='primary')= children
    `
  },
  img: P
}
