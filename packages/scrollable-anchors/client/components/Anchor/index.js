import React, { useEffect } from 'react'
import { observer } from 'startupjs'
import { Div } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { registerAnchor, unregisterAnchor } from '../../helpers'

function Anchor ({ id, children, style, Component, ...componentProps }) {
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

  useEffect(() => onUnmount, [])
  return pug`
    Component(
      ...componentProps
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
