import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { observer, useModel } from 'startupjs'
import './index.attr.styl' // @css_hash_-1679060978

export default observer(function Increment ({ stateCounter, setStateCounter }) {
  let $counter = useModel('counters.first')

  async function increment () {
    $counter.increment('value', 1)
    setStateCounter(stateCounter + 1)
  }

  return pug`
    TouchableOpacity.button(
      variation='increment'
      size=(stateCounter < 5 ? 'small' : (stateCounter > 10 ? 'large' : undefined))
      onPress=increment
    )
      Text.label +
  `
})
