import React from 'react'
import { observer } from 'startupjs'
import { Button } from '@startupjs/ui'
import { onLogout } from '../../helpers'

function LogoutButton () {
  return pug`
    Button(
      onPress=onLogout
      color='primary'
      variant='flat'
    ) Logout
  `
}

export default observer(LogoutButton)
