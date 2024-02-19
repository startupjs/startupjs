import React from 'react'
import { createPlugin } from 'startupjs/registry'
import { pug, styl } from 'startupjs'
import { Span } from '@startupjs/ui'

export default createPlugin({
  name: 'plugin1',
  for: 'playground',
  client: ({
    greeting = '',
    important,
    getMessage = m => m
  }) => ({
    renderMessage ({ username }) {
      return pug`
        Span.message(styleName={ important })= greeting + (greeting ? ' ' : '') + getMessage(username)
      `
      styl`
        .message
          color var(--color-text-primary)
          &.important
            color var(--color-text-error)
      `
    }
  })
})
