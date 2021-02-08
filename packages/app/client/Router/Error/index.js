import React from 'react'
import { View } from 'react-native'
import { observer } from 'startupjs'
import { defaultTemplates } from './templates'
import './index.styl'

export default observer(function Error ({ value, pages = {}, supportEmail }) {
  // TODO: Need to make the default layout better
  const Template = pages[value] || defaultTemplates[value] || defaultTemplates.default
  return pug`
    View.root
      Template(supportEmail=supportEmail)
  `
})
