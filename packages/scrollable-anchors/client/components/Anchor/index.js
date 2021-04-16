import React, { useEffect, useRef } from 'react'
import { View } from 'react-native'
import { observer, useOn } from 'startupjs'
import PropTypes from 'prop-types'
import { registerAnchor, unregisterAnchor } from '../../helpers'

function Anchor ({ id, children, style, Component, ...componentProps }) {
  const ref = useRef()

  function onUnmount () {
    unregisterAnchor(id)
  }

  function getPosition () {
    ref.current.measure((fx, fy) => {
      registerAnchor({
        anchorId: id,
        posY: fy
      })
    })
  }

  useOn('ScrollableProvider.recalcPositions', getPosition)

  useEffect(() => onUnmount, [])

  return pug`
    // Extra block to calculate correct y pos of element on parent size changes
    // IE: Parent can have dynamic content, we need recalc anchors positions when content changes
    View(ref=ref)
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
