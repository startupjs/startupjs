import { BASE_URL } from '@env'
import init from 'startupjs/init'
import orm from './model'
import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native'
import {
  observer,
  useDoc,
  useApi,
  $root
} from 'startupjs'
import axios from 'axios'

import './App.styl'

// Init startupjs connection to server and the ORM.
// baseUrl option is required for the native to work - it's used
// to init the websocket connection and axios.
// Initialization must start before doing any subscribes to data.
init({ baseUrl: BASE_URL, orm })

export default observer(function App () {
  let [counter, $counter] = useDoc('counters', 'first')
  if (!counter) throw $counter.addSelf() // custom ORM method (see /model/)

  let [stateCounter, setStateCounter] = useState(0)

  let forceTrigger = useForceTrigger(3000)
  let [api] = useApi(getApi, [forceTrigger])

  async function increment () {
    $counter.increment('value', 1)
    setStateCounter(stateCounter + 1)
  }

  async function decrement () {
    $counter.increment('value', -1)
    setStateCounter(stateCounter - 1)
  }

  async function reset () {
    $counter.reset() // custom ORM method (see /model/)
    setStateCounter(0)
  }

  return pug`
    View.body
      Text.greeting Hello World
      Text DB Counter: #{counter && counter.value}
      Text State Counter: #{stateCounter}
      TouchableOpacity.button.increment(onPress=increment)
        Text.label +
      TouchableOpacity.button.decrement(onPress=decrement)
        Text.label -
      TouchableOpacity.button.clear(onPress=reset)
        Text.label RESET
      Text.api /api (updated each 3 sec): #{JSON.stringify(api)}
  `
})

async function getApi () {
  try {
    let res = await axios.get('/api')
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
