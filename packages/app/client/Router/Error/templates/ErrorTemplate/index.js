import React from 'react'
import { Linking, Text, TouchableOpacity, View } from 'react-native'
import { observer, emit } from 'startupjs'
import './index.styl'

export default observer(function ErrorTemplate ({ title, description, supportEmail }) {
  return pug`
    View.root
      View.card
        if title
          Text.info= title
        if description
          Text.text.description= description
        if supportEmail
          Text.text.span If you think it's a mistake, please contact support
            Text= ' '
            Text.email(onPress=() => Linking.openURL('mailto:' + supportEmail))= supportEmail
            Text.text .
        TouchableOpacity.backButton(onPress=() => emit('error'))
          Text.text.label ◀︎  Go back
  `
})
