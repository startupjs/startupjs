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
  onChange
}, ref) {
  const media = useMedia()

  if (!visible) return null

  const isDrawer = !media.tablet
  const Component = isDrawer ? ContentDrawer : ContentPopover

  function getOption (item) {
    if (typeof item === 'string') return item
    if (typeof item === 'object') return item.value
  }

  function renderContent () {
    return pug`
      FlatList(
        ref=ref
        data=data
        keyExtractor=item => getOption(item)
        renderItem=(item, index) => renderItem(getOption(item), index)
      )
    `
  }

  return pug`
    Component(
      visible=visible
      refAnchor=refAnchor
      renderContent=renderContent
      onChange=onChange
    )
  `
}

const ObservedAD = observer(AbstractDropdown, { forwardRef: true })

ObservedAD.propTypes = {
  visible: PropTypes.bool,
  data: PropTypes.array,
  renderItem: PropTypes.func,
  onChange: PropTypes.func
}

export default ObservedAD
