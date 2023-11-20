import React from 'react'
import { pug, observer } from 'startupjs'
import ErrorTemplate from '../ErrorTemplate'

export default observer(function DefaultError ({ supportEmail }) {
  return pug`
    ErrorTemplate(
      title='Sorry, something went wrong. Please go back and try again.'
      supportEmail=supportEmail
    )
  `
})
