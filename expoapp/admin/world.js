import React from 'react'
import { observer } from 'startupjs'
import { Br, Span, Link, Button } from '@startupjs/ui'

export default observer(function Layout () {
  return pug`
    Span World Page
    Br
    Link(href='..')
      Button Go to Dashboard
  `
})
