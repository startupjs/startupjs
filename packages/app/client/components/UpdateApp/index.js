import React from 'react'
import { Button, Linking, Platform, Text } from 'react-native'
import { pug, observer } from 'startupjs'
import Layout from './../Layout'
import './index.styl'

const isIos = Platform.OS === 'ios'

export default observer(function UpdateApp ({ androidUpdateLink, iosUpdateLink, supportEmail }) {
  const link = isIos ? iosUpdateLink : androidUpdateLink
  const emailLink = 'mailto:' + supportEmail

  const description = pug`
    Text.text Sorry, your version of the app is too old.&nbsp;
    Text.text
      | Please update the app by visiting the&nbsp;
      if isIos
        | App Store
      else
        | Google Play
      | .&nbsp;
    if supportEmail
      Text.text If you have any questions, write to us at&nbsp;
        Text.email(onPress=() => Linking.openURL(emailLink))= supportEmail
        Text .
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
