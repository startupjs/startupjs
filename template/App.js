import 'startupjs/init'
import React, { memo } from 'react'
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
  let [counter, $counter] = useDoc('service', 'counter')

  if (!counter) throw new Promise(resolve => {
    $root.add('service', { id: 'counter', value: 0 }, resolve)
  })

  async function increment () {
    $counter.increment('value', 1)
  }

  async function decrement () {
    $counter.increment('value', -1)
  }

  return pug`
    View.body
      Text.greeting Hello World. Counter: #{counter && counter.value}
      TouchableOpacity.increment(onPress=increment)
        Text.label +
      TouchableOpacity.decrement(onPress=decrement)
        Text.label -
  `
})
