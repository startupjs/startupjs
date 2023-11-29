import React from 'react'
import { pug, observer, emit } from 'startupjs'
import { Span, Div, Button } from '@startupjs/ui'
import { SIGN_IN_URL } from '../../../../isomorphic'
import './index.styl'

function PConfirmedEmail () {
  return pug`
    Div.root
      Span.title Email confirmed
      Button.btn(onPress=() => emit('url', SIGN_IN_URL)) Login
  `
}

export default observer(PConfirmedEmail)
