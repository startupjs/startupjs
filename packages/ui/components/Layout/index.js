import React from 'react'
import { observer } from 'startupjs'
import { SafeAreaView } from 'react-native'
import StatusBar from './../StatusBar'
import propTypes from 'prop-types'
import './index.styl'

function Layout ({ style, children }) {
  return pug`
    SafeAreaView.root(style=style)
      StatusBar
      = children
  `
}

Layout.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node
}

export default observer(Layout)
