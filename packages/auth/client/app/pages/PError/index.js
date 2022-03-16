import React from 'react'
import { observer, emit } from 'startupjs'
import { Span, Card, Button } from '@startupjs/ui'
import { Text, TouchableOpacity, View } from 'react-native'
import { GOOGLE_AUTH_TOKEN_ERROR } from '../../../../isomorphic'
import './index.styl'

function PError ({
  baseUrl,
  redirectUrl,
  localForms,
  renderForm,
  onError,
  onSuccess,
  onHandleError
}) {
  return pug`
    Card.root(variant='outlined')
      Span.title= GOOGLE_AUTH_TOKEN_ERROR
      Button.btn(onPress=() => emit('url', '/')) ◀︎  Go back
  `
}

export default observer(PError)
