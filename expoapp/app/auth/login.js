import React from 'react'
import { pug, styl, observer, sub, $, auth } from 'startupjs'
import { Content, Button, User, Card } from '@startupjs/ui'

const PROVIDERS = {
  // google: true,
  github: true
}

export default observer(function Success () {
  const $user = sub($.users[$.session.userId.get()])

  return pug`
    Content(padding gap full align='center' vAlign='center')
      if $user.get()
        Card.card
          User(
            avatarUrl=$user.avatarUrl.get()
            name=$user.name.get()
          )
      each provider in Object.keys(PROVIDERS)
        Button.button(
          key=provider
          onPress=() => auth(provider)
        )= 'Login with ' + provider.charAt(0).toUpperCase() + provider.slice(1)
  `
  styl`
    .card
      padding-top 1u
      padding-bottom 1u
    .button
      width 30u
  `
})
