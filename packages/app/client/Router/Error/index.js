import React from 'react'
import { Platform, WebView, View, Text } from 'react-native'
import { useHistory } from 'react-router-native'
import { observer } from 'startupjs'
import './index.styl'
const isWeb = Platform.OS === 'web'
const isIos = Platform.OS === 'ios'

export default observer(function Error ({ value, pages = {} }) {
  // TODO: Need to make the default layout better
  const history = useHistory()
  const status = parseInt(value)
  const html = pages[status]
  return pug`
    View.root
      if html
        if isWeb
          div(dangerouslySetInnerHTML={ __html: html })
        else
          WebView(
            source={html}
            scalesPageToFit=isIos ? false : true
          )
      else
        Text.title Error
        Text
          Text= 'Sorry, something went wrong. Please '
          Text.back(onPress=() => {
            history.goBack()
          }) go back
          Text= ' and try again.'
  `
})
