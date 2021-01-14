import React from 'react'
import { observer } from 'startupjs'
import { Button } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { onLogout } from '../../helpers'

function LogoutButton ({ baseUrl, redirectUrl }) {
  return pug`
    Button(
      onPress=() => onLogout(baseUrl, redirectUrl)
      color='primary'
      variant='flat'
    ) Logout
  `
}

LogoutButton.propTypes = {
  redirectUrl: PropTypes.string,
  baseUrl: PropTypes.string
}

export default observer(LogoutButton)
