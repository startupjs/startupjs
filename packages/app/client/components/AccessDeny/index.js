import React from 'react'
import { Text } from 'react-native'
import { observer, useSession } from 'startupjs'
import Layout from './../Layout'
import mailTo from '../Blocked/mailTo'
import './index.styl'

export default observer(function Blocked () {
  const [{ supportEmail } = {}] = useSession('criticalVersion.meta')

  const description = pug`
    Text If you think it's a mistake, please contact support
    if supportEmail
      Text &nbsp;at&nbsp;
      Text.email(onPress=() => mailTo(supportEmail))= supportEmail
      Text .
  `

  return pug`
    Layout(
      title='Sorry. Access deny!'
      description=description
    )
  `
})
