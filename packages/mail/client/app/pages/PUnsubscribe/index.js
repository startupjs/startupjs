import React from 'react'
import { observer, useLocal, useDoc, emit } from 'startupjs'
import { Span, Button, H4, Icon, Row } from '@startupjs/ui'
import { faEnvelopeOpenText, faEnvelope, faFrown, faSmile, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import './index.styl'

function PUnsubscribe () {
  const [userId] = useLocal('$render.params.userId')
  const [user, $user] = useDoc('auths', userId)

  const unsubscribed = user.emailSettings.unsubscribed

  const onSubscribeChange = () => {
    $user.set('emailSettings.unsubscribed', !user.emailSettings.unsubscribed)
  }

  return pug`
    Icon.icon(
      icon=unsubscribed ? faEnvelope : faEnvelopeOpenText
      size=100
    )
    H4.title
      = unsubscribed ? 'You have successfully unsubscribed from mailing' : 'Are you want to unsubscribe from mailing?'
    unless unsubscribed
      Span If you unsubscribe, you will stop receiving our emails
    Row
      Button.button(
        color=unsubscribed ? 'success' : 'error',
        variant='flat'
        icon=unsubscribed ? faSmile : faFrown
        onPress=onSubscribeChange
      )= unsubscribed ? 'Subscribe again' : 'Unsubscribe'
      Button.button(
        variant='text'
        icon=faArrowRight
        iconPosition='right'
        styleName='secondButton'
        onPress=() => emit('url', '/')
      ) Go to main page
  `
}

export default observer(PUnsubscribe)
