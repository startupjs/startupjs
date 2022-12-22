import React from 'react'
import { ScrollView, Image } from 'react-native'
import { observer, u } from 'startupjs'
import { Div, BackButton } from '@startupjs/ui'
import './index.styl'

export default observer(function Layout ({ children }) {
  return pug`
    ScrollView.root
      BackButton.backButton
      Div.logo
        Image(
          resizeMode='contain'
          style={ width: u(5), height: u(5) },
          source={ uri: '/img/docs.png' }
        )
      Div.wrapper
        = children
  `
})
