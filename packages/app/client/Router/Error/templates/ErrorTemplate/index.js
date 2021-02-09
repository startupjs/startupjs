import React from 'react'
import { Linking } from 'react-native'
import { observer, emit } from 'startupjs'
import { Card, H3, H5, Span, Button, Div } from '@startupjs/ui'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import './index.styl'

export default observer(function ErrorTemplate ({ title, description, supportEmail }) {
  return pug`
    Div.root
      Card.card
        if title
          H3.info= title
        if description
          H5= description
        if supportEmail
          Span If you think it's a mistake, please contact support
            Span.email(onPress=() => Linking.openURL('mailto:' + supportEmail))= ' ' + supportEmail
            Span .
        Button.backButton(icon=faArrowLeft onPress=() => emit('error')) Go back
  `
})
