import React from 'react'
import { observer, useSession, emit } from 'startupjs'
import { Card, H3, H5, Span, Button } from '@startupjs/ui'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import Layout from './../Layout'
import mailTo from '../Blocked/mailTo'
import './index.styl'

export default observer(function AccessDeny () {
  const [{ supportEmail } = {}] = useSession('criticalVersion.meta')
  const [, $accessError] = useSession('_accessError')

  function goTo (path) {
    $accessError.set('')
    emit('url', path)
  }

  const Description = pug`
    H5 If you think it's a mistake, please contact support
    if supportEmail
      Span &nbsp;at&nbsp;
      Span.email(onPress=() => mailTo(supportEmail))= supportEmail
      Span .
  `

  return pug`
    Layout(
      center
    )
      Card.card
        H3.info 403: Permission denied
        =Description

        Button.backButton(icon=faArrowLeft onPress=()=>goTo('/')) Go back

  `
})
