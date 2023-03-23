import React from 'react'
import { observer } from 'startupjs'
import ErrorTemplate from '../ErrorTemplate'

export default observer(function NotFound ({ supportEmail }) {
  return pug`
    ErrorTemplate(
      title='404: Page not found'
      supportEmail=supportEmail
    )
  `
})
