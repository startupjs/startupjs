import React, { useEffect, useRef } from 'react'
import { ScrollView } from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import { registerArea, unregisterArea } from '../../helpers'

function ScrollableArea ({ id, children, style, ...rest }) {
  const ref = useRef()

  useEffect(() => {
    if (ref.current) registerArea({ areaId: id, ref: ref.current })
  }, [ref.current])

  useEffect(() => unregisterArea(id), [])
  return pug`
    ScrollView(
      ref=ref
      style=style
      ...rest
    )
      = children
  `
}

ScrollableArea.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired
}

export default observer(ScrollableArea)
