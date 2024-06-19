import React from 'react'
import { pug, observer } from 'startupjs'
import { Span } from '@startupjs/ui'

export const cell = observer(({ $value }) => {
  return pug`
    Span(numberOfLines=1)= $value.get()
  `
})

export const settings = observer(({ $props }) => {
  return pug`
    Span Type: #{$props.type.get()}
    Span Input: #{$props.input.get()}
  `
})
