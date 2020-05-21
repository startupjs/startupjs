import React from 'react'
import { observer, useBackPress } from 'startupjs'
import { SafeAreaView, StatusBar } from 'react-native'
import propTypes from 'prop-types'
import { useHistory } from 'react-router-native'
import config from './../../config/rootConfig'
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
      StatusBar(
        backgroundColor=config.colors.darkLighter
        barStyle='dark-content'
      )
      = children
  `
}

Layout.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node
}

export default observer(Layout)
