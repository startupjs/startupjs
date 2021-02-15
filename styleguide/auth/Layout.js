import React from 'react'
import { ScrollView, Image } from 'react-native'
import { observer, u } from 'startupjs'
import { Div } from '@startupjs/ui'
import { SuccessRedirect } from '@startupjs/auth'
import './index.styl'

export default observer(function Layout ({ children }) {
  return pug`
    ScrollView.root
      Div.logo
        Image(
          resizeMode='contain'
          style={ width: u(5), height: u(5) },
          source={ uri: '/img/docs.png' }
        )
      Div.wrapper
        SuccessRedirect
          = children
  `
})
