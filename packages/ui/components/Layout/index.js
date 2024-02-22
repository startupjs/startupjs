import React from 'react'
import { SafeAreaView, StatusBar } from 'react-native'
import { pug, observer, useBackPress } from 'startupjs'
import PropTypes from 'prop-types'
import useRouter from '../../hooks/useRouter'
import themed from '../../theming/themed'
import STYLES from './index.styl'

const { config: { bgColor } } = STYLES

function Layout ({ children }) {
  const { back, canGoBack } = useRouter()

  useBackPress((backHandler) => {
    if (!canGoBack()) return // if first page then exit app
    back()
    return true
  })

  return pug`
    SafeAreaView.root(part='root')
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

export default observer(themed('Layout', Layout))
