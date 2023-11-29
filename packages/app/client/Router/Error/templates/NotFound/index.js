import React from 'react'
import { pug, observer } from 'startupjs'
import ErrorTemplate from '../ErrorTemplate'

export default observer(function NotFound () {
  return pug`
    ErrorTemplate(
      title='404'
      description='Page not found'
    )
  `
})
