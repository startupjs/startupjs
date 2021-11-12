import React from 'react'
import { FlatList } from 'react-native'
import { observer } from 'startupjs'
import { useMedia } from '@startupjs/ui'
import PropTypes from 'prop-types'
import Select from '../forms/Select'
import { getLabel } from '../forms/Select/Wrapper/helpers'
import { ContentPopover, ContentDrawer } from './components'

function AbstractDropdown ({
  children,
  visible,
  refAnchor,
  options,
  renderItem,
  onChange
}, ref) {
  const media = useMedia()

  if (!visible) return null

  const isDrawer = !media.tablet
  const Component = isDrawer ? ContentDrawer : ContentPopover

  function renderContent () {
    return pug`
      FlatList(
        ref=ref
        data=options
        keyExtractor=item=> getLabel(item)
        renderItem=({ item, index })=> renderItem(getLabel(item), index)
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
  options: Select.propTypes.options,
  renderItem: PropTypes.func,
  onChange: PropTypes.func
}

export default ObservedAD
