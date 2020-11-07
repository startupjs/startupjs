import React from 'react'
import { observer } from 'startupjs'
import { logout } from '../../helpers'
import { Button } from '@startupjs/ui'

function LogoutButton () {
  return pug`
    Button(
      onPress=logout
      color='primary'
      variant='flat'
    ) Logout
  `
}

export default observer(LogoutButton)
