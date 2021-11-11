import React from 'react'
import { FlatList } from 'react-native'
import { observer } from 'startupjs'
import { useMedia } from '@startupjs/ui'
import PropTypes from 'prop-types'
import { ContentPopover, ContentDrawer } from './components'

function AbstractDropdown ({
  children,
  visible,
  refAnchor,
  data,
  renderItem,
  keyExtractor,
  onChangeVisible
}, ref) {
  const media = useMedia()
  const isDrawer = !media.tablet

  function renderContent () {
    return pug`
      FlatList(
        ref=ref
        data=data
        renderItem=renderItem
        keyExtractor=keyExtractor
      )
    `
  }

  if (!visible) return null

  if (isDrawer) {
    return pug`
      ContentDrawer(
        visible=visible
        renderContent=renderContent
        onChangeVisible=onChangeVisible
      )= children
    `
  }

  return pug`
    ContentPopover(
      visible=visible
      refAnchor=refAnchor
      renderContent=renderContent
      onChangeVisible=onChangeVisible
    )= children
  `
}

const ObservedAD = observer(AbstractDropdown, { forwardRef: true })

ObservedAD.propTypes = {
  visible: PropTypes.bool,
  data: PropTypes.array,
  renderItem: PropTypes.func,
  keyExtractor: PropTypes.func,
  onChangeVisible: PropTypes.func
}

export default ObservedAD
