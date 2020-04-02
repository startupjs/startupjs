import React from 'react'
import SyntaxHighlighter from 'react-native-syntax-highlighter'
import { Div, H2, H5, H6, Hr, Span, Br } from '@startupjs/ui'
import './index.styl'

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
  h4: ({ children }) => pug`
    H6.h6(bold)= children
  `,
  h5: ({ children }) => pug`
    H6.h6(bold)= children
  `,
  h6: ({ children }) => pug`
    H6.h6(bold)= children
  `,
  p: ({ children }) => pug`
    Span.p(size='l')= children
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
  }
}
