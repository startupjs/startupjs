import React from 'react'
import { SafeAreaView, StatusBar } from 'react-native'
import { pug, observer } from 'startupjs'
import PropTypes from 'prop-types'
import themed from '../../theming/themed'
import STYLES from './index.styl'

const { config: { bgColor } } = STYLES

function Layout ({ children }) {
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
