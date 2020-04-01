import React from 'react'
import { Text, View } from 'react-native'

export default {
  wrapper: ({ children }) => pug`
    View= children
  `,
  h1: ({ children }) => pug`
    Text= children
  `,
  pre: ({ children }) => pug`
    Text(style={ color: 'blue' })= children
  `,
  code: ({ children }) => pug`
    Text= children
  `
}
