import React from 'react'
import { observer } from 'startupjs'
import { defaultTemplates } from './templates'

export default observer(function Error ({ value, pages = {}, supportEmail }) {
  // TODO: Need to make the default layout better
  const Template = pages[value] || defaultTemplates[value] || defaultTemplates.default
  return pug`
    Template(supportEmail=supportEmail)
  `
})
