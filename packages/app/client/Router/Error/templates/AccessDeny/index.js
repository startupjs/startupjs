import React from 'react'
import { observer, emit } from 'startupjs'
import ErrorTemplate from '../ErrorTemplate'

export default observer(function AccessDeny () {
  return pug`
    ErrorTemplate(
        title='403: Permission denied',
        description= 'If you think it\'s a mistake, please contact support',
        isSupportEmailBlock=true,
        goBack=() => emit('error', '')
      )
  `
})
