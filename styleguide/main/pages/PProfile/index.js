import React from 'react'
import { useHistory } from 'react-router-native'
import { observer, useSession, useDoc } from 'startupjs'
import { Span, Avatar, Layout, Content, Div, Button } from '@startupjs/ui'
import { LogoutButton } from '@startupjs/auth'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import './index.styl'

export default observer(function PProfile () {
  const [userId] = useSession('userId')
  const [user] = useDoc('users', userId)
  const history = useHistory()

  if (!user) return null

  return pug`
    Layout.main
      Button.backButton(
        icon=faArrowLeft
        size='m'
        variant='text'
        onPress=() => history.goBack()
      ) 
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
