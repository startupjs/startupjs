import React from 'react'
import { observer, useBackPress } from 'startupjs'
import { SafeAreaView } from 'react-native'
import StatusBar from './../StatusBar'
import propTypes from 'prop-types'
import { useHistory } from 'react-router-native'
import './index.styl'

function Layout ({ style, children }) {
  const history = useHistory()

  useBackPress((backHandler) => {
    if (!history.index) return // if first page then exit app
    history.goBack()
    return true
  })

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
