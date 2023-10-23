import React from 'react'
import { Button, Text } from 'react-native'
import { pug, observer } from 'startupjs'
import Layout from './../Layout'

export default observer(function UpdateApp () {
  const description = pug`
    Text
      | Sorry, we have just received a new critical update.
      | Please refresh the page to continue.
  `
  return pug`
    Layout(
      title='New updates available.'
      description=description
      center
    )
      Button(
        title='Refresh'
        onPress=() => window.location.reload(true)
      )
  `
})
