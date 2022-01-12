import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native'
import {
  pug,
  observer,
  useDoc,
  useApi
} from 'startupjs'
import axios from 'axios'
import './index.styl'

export default observer(function TestComponent () {
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
    View.body
      Text TestThing counter: #{testThing.counter}
      TouchableOpacity.button.increment(onPress=increment)
        Text.label +
      TouchableOpacity.button.decrement(onPress=decrement)
        Text.label -
      TouchableOpacity.button.clear(onPress=reset)
        Text.label RESET
      Text REST API call to '/api/test-thing' (updated each 3 sec): #{JSON.stringify(api)}
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
