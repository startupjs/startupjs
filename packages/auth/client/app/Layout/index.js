import React from 'react'
import { SuccessRedirect } from '../../components'
import { observer } from 'startupjs'

export default observer(function Layout ({ children }) {
  return pug`
    SuccessRedirect
      = children
  `
})
