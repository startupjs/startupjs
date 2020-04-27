import React from 'react'
import SyntaxHighlighter from 'react-native-syntax-highlighter'
import { Div, H2, H5, H6, Hr, Span, Br, Row, Link } from '@startupjs/ui'
import { Platform } from 'react-native'
import './index.styl'

function P ({ children }) {
  return pug`
    Span.p(size='l')= children
  `
}

export default {
  wrapper: ({ children }) => pug`
    Div= children
  `,
  example: ({ children }) => pug`
    Div.example= children
  `,
  h1: ({ children }) => pug`
    H2(bold)= children
  `,
  h2: ({ children }) => pug`
    H5.h2= children
    Hr(size='l')
  `,
  h3: ({ children }) => pug`
    H6.h6(bold)= children
  `,
  p: P,
  strong: ({ children }) => pug`
    Span.p(size='l' bold)= children
  `,
  em: ({ children }) => pug`
    Span.p(size='l' italic)= children
  `,
  pre: ({ children }) => children,
  code: ({ children, className }) => {
    const language = (className || '').replace(/language-/, '')
    return pug`
      Br
      SyntaxHighlighter(
        language=language
        highlighter='prism'
        fontSize=14
        customStyle={
          margin: 0,
          overflow: 'hidden',
          padding: 16,
          backgroundColor: '#fafafa',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8
        }
      )= children.replace(/\n$/, '')
    `
  },
  inlineCode: ({ children }) => pug`
    Span(size='l').inlineCode
      Span(size='l')= ' '
      Span(
        size='l'
        style={
          fontFamily: Platform.OS === 'ios' ? 'Menlo-Regular' : 'monospace'
        }
      )= children
      Span(size='l')= ' '
  `,
  hr: ({ children }) => pug`
    Hr(size='l')
  `,
  // TODO: https://mdxjs.com/getting-started#table-of-components
  //       Mock everything as P for now.
  h4: P,
  h5: P,
  h6: P,
  thematicBreak: P,
  blockquote: P,
  ul: ({ children }) => children,
  ol: ({ children }) => React.Children.map(children, (child, index) => React.cloneElement(child, { index })),
  li: ({ children, index }) => {
    let hasTextChild = false
    children = React.Children.map(children, child => {
      if (typeof child === 'string') {
        hasTextChild = true
      }
      return child
    })
    return pug`
      Row
        Span.listIndex(size='l')= index == null ? '-' : index + 1 + '.'
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
      Link(size='l' to=href)= children
    `
  },
  img: P
}
