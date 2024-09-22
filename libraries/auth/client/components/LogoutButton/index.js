import React from 'react'
import { pug, observer } from 'startupjs'
import { Button } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { onLogout } from '../../helpers'

function LogoutButton ({ baseUrl, redirectUrl }) {
  return pug`
    Button(
      color='primary'
      variant='flat'
      onPress=() => onLogout({ baseUrl, redirectUrl })
    ) Logout
  `
}

LogoutButton.propTypes = {
  redirectUrl: PropTypes.string,
  baseUrl: PropTypes.string
}

export default observer(LogoutButton)
