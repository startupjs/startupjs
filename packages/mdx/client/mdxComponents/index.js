import React from 'react'
import SyntaxHighlighter from 'react-native-syntax-highlighter'
import { Div, H2, H5, H6, Hr, Span, Br } from '@startupjs/ui'
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
      SyntaxHighlighter(
        language=language
        highlighter='prism'
        fontSize=14
        customStyle={ margin: 0, overflow: 'hidden', backgroundColor: '#fafafa' }
      )= children.replace(/\n$/, '')
    `
  },
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
  ul: P,
  ol: P,
  li: P,
  table: P,
  thead: P,
  tbody: P,
  tr: P,
  td: P,
  th: P,
  delete: P,
  inlineCode: P,
  a: P,
  img: P
}
