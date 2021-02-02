import React from 'react'
import { ScrollView } from 'react-native'
import { observer } from 'startupjs'
import { Div } from '@startupjs/ui'
import { SuccessRedirect } from '../../components'
import './index.styl'

export default observer(function Layout ({ children }) {
  return pug`
    ScrollView.root
      Div.wrapper
        SuccessRedirect
          = children
  `
})
