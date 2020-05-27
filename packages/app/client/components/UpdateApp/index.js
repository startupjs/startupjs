import React from 'react'
import { observer, useSession } from 'startupjs'
import Layout from './../Layout'
import { Platform, Linking, Button, Text } from 'react-native'
const isIos = Platform.OS === 'ios'

export default observer(function UpdateApp () {
  const [{ iosUpdateLink, androidUpdateLink } = {}] = useSession('criticalVersion.meta')

  const link = isIos ? iosUpdateLink : androidUpdateLink

  const description = pug`
    Text Sorry, your version of the app is too old.
    Text
      | Please update the app by visiting the&nbsp;
      if isIos
        | App Store
      else
        | Google Play
      | .
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
