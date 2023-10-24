import React, { useState } from 'react'
import { pug, observer } from 'startupjs'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import Br from '../../Br'
import Button from '../index'

function ButtonTests () {
  const [counter, setCounter] = useState(0)
  const [disabledButtonLabel, setDisabledButtonLabel] = useState('Disabled button')
  const [asyncButtonLabel, setAsyncButtonLabel] = useState('')

  async function onPressAsyncButton () {
    await new Promise(resolve => {
      setTimeout(() => {
        setAsyncButtonLabel('Async operation - done')
        resolve()
      }, 10000)
    })
  }

  const fn = () => null

  return pug`
    Button(
      onPress=() => setCounter(counter + 1)
      color='primary'
      variant='flat'
      testID='primaryButton'
      icon=faCheck
    )= 'Clicked ' + counter + ' times'
    Br
    Button(
      onPress=onPressAsyncButton
      testID='asyncButton'
    )= asyncButtonLabel
    Br
    Button(
      testID='xsButton'
      size='xs'
      onPress=fn
    ) XS Button
    Br
    Button(
      testID='disabledButton'
      disabled
      onPress=() => setDisabledButtonLabel('Pressed')
    )= disabledButtonLabel
  `
}

export default observer(ButtonTests)
