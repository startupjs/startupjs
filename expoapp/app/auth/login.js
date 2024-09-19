import React from 'react'
import { Image } from 'react-native'
import { pug, styl, observer, useSub, $, login, logout } from 'startupjs'
import { Content, Button, User, Card, Input, H6, Tag, Alert, Br, ScrollView, Item, Modal } from '@startupjs/ui'

const PROVIDERS = ['github']

export default observer(function Success () {
  const userId = $.session.userId.get()
  const $user = useSub($.users[userId])
  const $auth = useSub($.auths[userId])
  const authProviderIds = $.session.authProviderIds.get() || []
  const loggedIn = $.session.loggedIn.get()
  const $showForceLogin = $()
  const $showChangePhoto = $()

  return pug`
    ScrollView(full): Content(padding gap full align='center' vAlign='center')
      if $user.get()
        Card.card(onPress=() => $showChangePhoto.set(true))
          if $user.avatarFileId.get()
            Photo(
              key=$user.avatarFileId.get()
              fileId=$user.avatarFileId.get()
              name=$user.name.get()
            )
          else
            User(
              avatarUrl=$user.avatarUrl.get()
              name=$user.name.get()
            )
        Modal($visible=$showChangePhoto)
          ChangePhoto($fileId=$user.avatarFileId)
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
      if !loggedIn
        Local
      if loggedIn
        Button.button(
          variant='text'
          color='error'
          onPress=logout
        ) Logout
        Input(type='checkbox' $value=$showForceLogin label='Show force login')
        if $showForceLogin.get()
          ForceLogin
  `
  styl`
    .card
      padding-top 1u
      padding-bottom 1u
    .button
      width 30u
  `
})

const Photo = observer(({ fileId, name }) => {
  const $file = useSub($.files[fileId])
  let url
  try { url = $file.getUrl() } catch (err) {}
  return pug`
    User(key=url part='root' avatarUrl=url name=name)
  `
})

const ChangePhoto = observer(({ $fileId }) => {
  return pug`
    if ($fileId.get())
      PhotoPreview(key=$fileId.get() $fileId=$fileId)
    Input(type='file' label='My photo' $value=$fileId image)
  `
})

const PhotoPreview = observer(({ $fileId }) => {
  const $file = useSub($.files[$fileId.get()])
  let url
  try { url = $file.getUrl() } catch (err) {}
  return pug`
    if url
      Image.preview(key=url source={ uri: url })
  `
  styl`
    .preview
      width 200px
      height @width
  `
})

const ForceLogin = observer(() => {
  const $users = useSub($.users, {})
  return pug`
    Card
      each $user in $users
        Item(
          key=$user.getId()
          onPress=() => login('force', { userId: $user.getId() })
        ) #{$user.name.get()}
  `
})

const Local = observer(() => {
  const $login = $({})
  const $loginError = $()
  const $register = $({})
  const $registerError = $()

  async function handleLogin () {
    try {
      await login('local', $login.get())
    } catch (err) {
      $loginError.set(err.message)
    }
  }
  async function handleRegister () {
    try {
      await login('local', { register: true, ...$register.get() })
    } catch (err) {
      $registerError.set(err.message)
    }
  }
  return pug`
    Card
      H6 Login
      Br
      Input(
        type='object'
        properties=loginProperties
        $value=$login
      )
      if $loginError.get()
        Br
        Alert(variant='error')= $loginError.get()
      Br
      Button(onPress=handleLogin) Login
    Br
    Card
      H6 Register
      Br
      Input(
        type='object'
        properties=registerProperties
        $value=$register
      )
      if $registerError.get()
        Br
        Alert(variant='error')= $registerError.get()
      Br
      Button(onPress=handleRegister) Register
  `
})

const loginProperties = {
  email: {
    type: 'string',
    label: 'Email',
    required: true
  },
  password: {
    type: 'string',
    label: 'Password',
    input: 'password',
    required: true
  }
}

const registerProperties = {
  email: {
    type: 'string',
    label: 'Email',
    required: true
  },
  password: {
    type: 'string',
    label: 'Password',
    input: 'password',
    required: true
  },
  confirmPassword: {
    type: 'string',
    label: 'Confirm password',
    input: 'password',
    required: true
  },
  name: {
    type: 'string',
    label: 'Name'
  }
}
