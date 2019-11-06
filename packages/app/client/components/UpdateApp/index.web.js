import React from 'react'
import { observer } from 'startupjs'
import Layout from './../Layout'
import { Button, Text } from 'react-native'

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
