import React from 'react'
import { observer } from 'startupjs'
import { onLogout } from '../../helpers'
import { Button } from '@startupjs/ui'

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
