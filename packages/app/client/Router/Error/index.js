import React from 'react'
import { observer } from 'startupjs'
import { defaultTemplates } from './templates'

export default observer(function Error ({ error, pages = {}, supportEmail }) {
  const errorCode = error.code
  const Template = pages[errorCode] || defaultTemplates[errorCode] || defaultTemplates.default
  return pug`
    Template(supportEmail=supportEmail error=error)
  `
})
