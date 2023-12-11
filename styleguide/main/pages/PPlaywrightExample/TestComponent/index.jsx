import React from 'react'
import { pug, observer, useDoc } from 'startupjs'
import { Br, Button, Card, Div, Span } from '@startupjs/ui'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import './index.styl'

export default observer(function TestComponent () {
  const [testThing, $testThing] = useDoc('testThings', 'first')

  async function increment () {
    await $testThing.increment('counter', 1)
  }

  async function decrement () {
    await $testThing.increment('counter', -1)
  }

  async function reset () {
    await $testThing.reset() // custom ORM method (see /model/)
  }

  return pug`
    Div.root
      Span
        | TestThing counter:#{' '}
        Span.counter(bold) #{testThing.counter}
      Br
      Div(row)
        Button(
          variant='flat'
          color='bg-success'
          size='l'
          onPress=increment
          icon=faPlus
          pushed
        )
        Button(
          pushed
          variant='flat'
          color='bg-error'
          size='l'
          onPress=decrement
          icon=faMinus
        )
      Br
      Button(color='warning' size='s' onPress=reset) RESET
      Br
      Card(variant='outlined')
        Span(description)
          | Open the same page in another browser tab or in mobile app to see counter update in real time.
  `
})
