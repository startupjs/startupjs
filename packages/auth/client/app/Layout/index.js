import React from 'react'
import { observer } from 'startupjs'
import { SuccessRedirect } from '../../components'

export default observer(function Layout ({ children }) {
  return pug`
    SuccessRedirect
      = children
  `
})
