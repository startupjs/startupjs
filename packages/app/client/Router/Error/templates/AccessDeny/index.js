import React from 'react'
import { pug, observer } from 'startupjs'
import ErrorTemplate from '../ErrorTemplate'

export default observer(function AccessDeny ({ supportEmail }) {
  return pug`
    ErrorTemplate(
      title='403: Permission denied'
      supportEmail=supportEmail
    )
  `
})
