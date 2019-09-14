import 'startupjs/init'
import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native'
import {
  observer,
  useDoc,
  $root
} from 'startupjs'

import './App.styl'

export default observer(function App () {
  let [dbCounter, $dbCounter] = useDoc('service', 'counter')
  let [stateCounter, setStateCounter] = useState(0)

  if (!dbCounter) throw new Promise(resolve => {
    $root.add('service', { id: 'counter', value: 0 }, resolve)
  })

  async function increment () {
    $dbCounter.increment('value', 1)
    setStateCounter(stateCounter + 1)
  }

  async function decrement () {
    $dbCounter.increment('value', -1)
    setStateCounter(stateCounter - 1)
  }

  return pug`
    View.body
      Text.greeting Hello World
      Text DB Counter: #{dbCounter && dbCounter.value}.
      Text State Counter: #{stateCounter}
      TouchableOpacity.increment(onPress=increment)
        Text.label +
      TouchableOpacity.decrement(onPress=decrement)
        Text.label -
  `
})
