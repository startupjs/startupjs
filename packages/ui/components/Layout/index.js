import React from 'react'
import { observer, useBackPress } from 'startupjs'
import PropTypes from 'prop-types'
import { SafeAreaView, StatusBar } from 'react-native'
import { useHistory } from 'react-router-native'
import STYLES from './index.styl'

const {
  config: {
    bgColor
  }
} = STYLES

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
        backgroundColor=bgColor
        barStyle='dark-content'
      )
      = children
  `
}

Layout.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node
}

export default observer(Layout)
