import React from 'react'
import { observer } from 'startupjs'
import ErrorTemplate from '../ErrorTemplate'

export default observer(function NotFound () {
  return pug`
    ErrorTemplate(
      title='404'
      description='Page not found'
    )
  `
})
