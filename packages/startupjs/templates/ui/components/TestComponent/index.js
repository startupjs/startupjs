import React, { useState, useEffect } from 'react'
import {
  observer,
  useApi,
  useDoc
} from 'startupjs'
import { Br, Button, Card, Div, Row, Span } from '@startupjs/ui'
import axios from 'axios'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import './index.styl'

export default observer(function TestComponent ({ style }) {
  const [testThing, $testThing] = useDoc('testThings', 'first')
  if (!testThing) throw $testThing.addSelf() // custom ORM method (see /model/)

  const forceTrigger = useForceTrigger(3000)
  const [api] = useApi(getApi, [forceTrigger])

  async function increment () {
    $testThing.increment('counter', 1)
  }

  async function decrement () {
    $testThing.increment('counter', -1)
  }

  async function reset () {
    $testThing.reset() // custom ORM method (see /model/)
  }

  return pug`
    Div.root(style=style)
      Span
        | TestThing counter:#{' '}
        Span.counter(bold) #{testThing.counter}
      Br
      Row
        Button(
          variant='flat'
          color='success'
          size='l'
          onPress=increment
          icon=faPlus
        )
        Button(
          pushed
          variant='flat'
          color='error'
          size='l'
          onPress=decrement
          icon=faMinus
        )
      Br
      Button(color='warning' size='s' onPress=reset) RESET
      Br
      Card(variant='outlined')
        Span(variant='description')
          | Open the same page in another browser tab or in mobile app to see counter update in real time.
      Br
      Card.rest
        Span(bold) REST API call to '/api/test-thing' (updated each 3 sec):
        Span #{JSON.stringify(api)}
  `
})

async function getApi () {
  try {
    let res = await axios.get('/api/test-thing')
    if (res.status !== 200 || !res.data) {
      throw new Error('No data. Status: ' + res.status)
    }
    return res.data
  } catch (err) {
    return err.message
  }
}

// Custom hook. A way to rerun something each `delay` ms.
// WARNING! This is for demo purposes only. Don't use this trick
// in production since the useApi data is not getting cleaned up.
function useForceTrigger (delay = 3000) {
  let [forceTrigger, setForceTrigger] = useState(0)
  useEffect(() => {
    let timer = setTimeout(() => {
      setForceTrigger(forceTrigger + 1)
    }, delay)
    return () => clearTimeout(timer)
  }, [forceTrigger])
  return forceTrigger
}
