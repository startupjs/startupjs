import React from 'react'
import { ScrollView, Image } from 'react-native'
import { observer, u } from 'startupjs'
import { useHistory } from '@startupjs/app'
import { Div, Button } from '@startupjs/ui'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import './index.styl'

export default observer(function Layout ({ children }) {
  const history = useHistory()

  return pug`
    ScrollView.root
      Button.backButton(
        icon=faArrowLeft
        size='m'
        variant='text'
        onPress=() => history.goBack()
      ) 
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
