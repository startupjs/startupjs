import React from 'react'
import { observer, pug } from 'startupjs'
import { Div, Span, Link, Button, Br } from '@startupjs/ui'

export default observer(function Layout () {
  return pug`
    Span Dashboard
    Br
    Div(row gap)
      Link(href='./hello')
        Button Go to Hello
      Link(href='./world')
        Button Go to World

  `
})
