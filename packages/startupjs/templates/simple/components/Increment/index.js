import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { observer, useModel } from 'startupjs'
import './index.styl'

export default observer(function Increment ({ stateCounter, setStateCounter }) {
  let $counter = useModel('counters.first')

  async function increment () {
    $counter.increment('value', 1)
    setStateCounter(stateCounter + 1)
  }

  return pug`
    TouchableOpacity.button(
      styleName=[
        'increment'
        (stateCounter < 5 ? 'small' : (stateCounter > 10 ? 'large' : undefined))
      ]
      variation='increment'
      onPress=increment
    )
      Text.label +
  `
})
