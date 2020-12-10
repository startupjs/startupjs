import React from 'react'
import { observer } from 'startupjs'
import { Div } from '@startupjs/ui'
import { SuccessRedirect } from '../../components'
import './index.styl'

export default observer(function Layout ({ children }) {
  return pug`
    Div.root
      Div.wrapper
        SuccessRedirect
          = children
  `
})
