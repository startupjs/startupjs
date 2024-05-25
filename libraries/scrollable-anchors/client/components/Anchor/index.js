import React, { useEffect, useRef } from 'react'
import { View, Platform } from 'react-native'
import { pug, observer, useOn } from 'startupjs'
import PropTypes from 'prop-types'
import { registerAnchor, unregisterAnchor } from '../../helpers'

const isAndroid = Platform.OS === 'android'

function Anchor ({ id, children, style, Component, ...componentProps }) {
  const ref = useRef()

  function onUnmount () {
    unregisterAnchor(id)
  }

  function getPosition () {
    // Measure doesn't work properly under Android
    // It always receives ( x: 0, y: 0 ) so Anchors will not work with nested ScrollableAreas
    // Android anchors will work with top level ScrollableProvider
    ref.current.measure((x, y, width, height, px, py) => {
      registerAnchor({
        anchorId: id,
        posY: Math.round(isAndroid ? py : y)
      })
    })
  }

  useOn('ScrollableProvider.recalcPositions', getPosition)

  useEffect(() => onUnmount, [])

  return pug`
    // Extra block to calculate correct y pos of element on parent size changes
    // IE: Parent can have dynamic content, we need recalc anchors positions when content changes
    // + issue with Android and ref.measure https://github.com/facebook/react-native/issues/3282#issuecomment-201934117
    // collapsable false is required to measureInWindow item correectly
    View(ref=ref collapsable=false)
    Component(
      ...componentProps
      style=style
    )
      = children
  `
}

Anchor.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired,
  Component: PropTypes.elementType.isRequired
}

Anchor.defaultProps = {
  Component: View,
  style: {}
}

export default observer(Anchor)
