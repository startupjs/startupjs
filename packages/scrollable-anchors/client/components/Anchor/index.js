import React, { useEffect, useState } from 'react'
import { observer, useOn } from 'startupjs'
import { Div } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { registerAnchor, unregisterAnchor } from '../../helpers'
function Anchor ({ id, children, style, Component, ...componentProps }) {
  const [key, setKey] = useState(0)

  function _onLayout (e) {
    const { nativeEvent: { layout } } = e
    registerAnchor({
      anchorId: id,
      posY: layout.y
    })

    if (componentProps.onLayout) {
      componentProps.onLayout(e)
    }
  }

  function onUnmount () {
    unregisterAnchor(id)
  }

  // To force onLayout trigger to recalculate positions on list height change
  function rerender () {
    setKey(key + 1)
  }

  useOn('ScrollableProvider.recalcPositions', rerender)

  useEffect(() => onUnmount, [])
  return pug`
    Component(
      ...componentProps
      key=key
      onLayout=_onLayout
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
  Component: Div,
  style: {}
}

export default observer(Anchor)
