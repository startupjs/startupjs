import React from 'react'
import { pug, styl, observer, sub, $, login, logout } from 'startupjs'
import { Content, Button, User, Card, Tag } from '@startupjs/ui'

const PROVIDERS = ['github']

export default observer(function Success () {
  const userId = $.session.userId.get()
  const $user = sub($.users[userId])
  const $auth = sub($.auths[userId])
  const authProviderIds = $.session.authProviderIds.get() || []
  const loggedIn = $.session.loggedIn.get()

  return pug`
    Content(padding gap full align='center' vAlign='center')
      if $user.get()
        Card.card
          User(
            avatarUrl=$user.avatarUrl.get()
            name=$user.name.get()
          )
      each provider in PROVIDERS
        - const loggedIn = authProviderIds.includes(provider)
        Button.button(
          key=provider
          disabled=loggedIn
          onPress=() => login(provider)
        )= (loggedIn ? 'Logged in' : 'Login') + ' with ' + provider.charAt(0).toUpperCase() + provider.slice(1)
        if loggedIn && provider === 'github'
          if $auth.github.scopes.get()?.includes('read:user')
            Tag(key=provider + '_tag' color='success') Access to GitHub user profile granted
          else
            Button.button(
              key=provider + '_grant'
              variant='text'
              onPress=() => login('github', { extraScopes: ['read:user'] })
            ) Grant access to GitHub profile
      if loggedIn
        Button.button(
          variant='text'
          color='error'
          onPress=logout
        ) Logout
  `
  styl`
    .card
      padding-top 1u
      padding-bottom 1u
    .button
      width 30u
  `
})
