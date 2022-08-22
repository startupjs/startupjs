import React from 'react'
import { observer } from 'startupjs'
import { defaultTemplates } from './templates'

export default observer(function Error ({ error, pages = {}, supportEmail }) {
  const code = error.code || 'default'
  const Template = pages[code] || defaultTemplates[code]

  return pug`
    Template(supportEmail=supportEmail error=error)
  `
})
