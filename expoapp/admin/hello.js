import React from 'react'
import { observer, pug } from 'startupjs'
import { Br, Div, Span, Link, Button, alert } from 'startupjs-ui'
import { useRouter, Slot } from '@startupjs/router'

export default observer(function Layout () {
  const router = useRouter()
  return pug`
    Slot(name='actions')
      Button(onPress=() => alert('Hello action')) Hello action
    Span Hello Page
    Br
    Div(gap row)
      Link(href='..')
        Button Go to Dashboard
      Link(href='/')
        Button Home
    Br
    Div(gap row)
      Button(onPress=() => router.navigate('..')) Go to Dashboard (imperative)
      Button(onPress=() => router.navigate('/')) Home (imperative)

  `
})
