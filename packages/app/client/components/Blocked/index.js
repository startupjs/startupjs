import React from 'react'
import { observer } from 'startupjs'
import Layout from './../Layout'
import { Text } from 'react-native'
import mailTo from './mailTo'
import './index.styl'

export default observer(function Blocked ({ email }) {
  const description = pug`
    Text If you think it's a mistake, please contact support
    if email
      Text &nbsp;at&nbsp;
      Text.email(onPress=() => mailTo(email))= email
      Text .
  `

  return pug`
    Layout(
      title='Sorry. You have been blocked.'
      description=description
    )
  `
})
