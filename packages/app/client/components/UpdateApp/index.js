import React from 'react'
import { Platform, Linking, Button, Text } from 'react-native'
import { observer } from 'startupjs'
import { Link } from '@startupjs/ui'
import Layout from './../Layout'
const isIos = Platform.OS === 'ios'

export default observer(function UpdateApp ({ androidUpdateLink, iosUpdateLink, supportEmail }) {
  const link = isIos ? iosUpdateLink : androidUpdateLink
  const emailLink = 'mailto:' + supportEmail

  const description = pug`
    Text Sorry, your version of the app is too old.
    Text
      | Please update the app by visiting the&nbsp;
      if isIos
        | App Store
      else
        | Google Play
      | .
    if supportEmail
      Text
        | If you have any questions, write to us at 
        Link(to=emailLink)=supportEmail
  `
  return pug`
    Layout(
      title='New version available.'
      description=description
      center
    )
      if link
        Button(
          title='Update'
          onPress=() => Linking.openURL(link)
        )
  `
})
