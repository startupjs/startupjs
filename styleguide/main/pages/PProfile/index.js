import React from 'react'
import { observer, useSession, useDoc } from 'startupjs'
import { Span, Avatar, Layout, Content, Div } from '@startupjs/ui'
import { LogoutButton } from '@startupjs/auth'
import { BackButton } from 'components'
import './index.styl'

export default observer(function PProfile () {
  const [userId] = useSession('userId')
  const [user] = useDoc('users', userId)

  if (!user) return null

  return pug`
    Layout.main
      BackButton 
      Content
        Div.root
          Avatar(
            size='l'
            src=user.avatarUrl
          )
          Div.info
            Span.line(bold)= user.firstName + ' ' + user.lastName
            Span.line= user.email
          LogoutButton
  `
})
