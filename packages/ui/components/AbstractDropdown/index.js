import React from 'react'
import { FlatList } from 'react-native'
import { observer } from 'startupjs'
import { useMedia } from '@startupjs/ui'
import PropTypes from 'prop-types'
import AbstractPopover from '../AbstractPopover'
import Drawer from '../popups/Drawer'
import { ContentPopover, ContentDrawer } from './components'

function AbstractDropdown ({
  children,
  visible,
  refAnchor,
  data,
  extraData,
  renderItem,
  keyExtractor,
  scrollEventThrottle,
  popoverOnly,
  popoverProps,
  drawerProps,
  getItemLayout,
  onSelectIndex,
  onEnterIndex,
  onRequestOpen,
  onChangeVisible
}, ref) {
  const media = useMedia()
  const isDrawer = !media.tablet && !popoverOnly

  function renderContent () {
    return pug`
      FlatList(
        ref=ref
        data=data
        extraData=extraData
        renderItem=renderItem
        keyExtractor=keyExtractor
        scrollEventThrottle=scrollEventThrottle
        getItemLayout=getItemLayout
      )
    `
  }

  if (!visible) return null

  if (isDrawer) {
    return pug`
      ContentDrawer(
        ...drawerProps
        visible=visible
        data=data
        renderContent=renderContent
        onSelectIndex=onSelectIndex
        onEnterIndex=onEnterIndex
        onRequestOpen=onRequestOpen
        onChangeVisible=onChangeVisible
      )= children
    `
  }

  return pug`
    ContentPopover(
      ...popoverProps
      visible=visible
      data=data
      refAnchor=refAnchor
      renderContent=renderContent
      onSelectIndex=onSelectIndex
      onEnterIndex=onEnterIndex
      onRequestOpen=onRequestOpen
      onChangeVisible=onChangeVisible
    )= children
  `
}

const ObservedDropdown = observer(AbstractDropdown, { forwardRef: true })

ObservedDropdown.defaultProps = {
  popoverOnly: false,
  popoverProps: {
    position: 'bottom',
    attachment: 'start',
    placements: AbstractPopover.defaultProps.placements
  },
  drawerProps: {
    position: 'bottom'
  }
}

ObservedDropdown.propTypes = {
  popoverOnly: PropTypes.bool,
  popoverProps: PropTypes.shape({
    position: AbstractPopover.propTypes.position,
    attachment: AbstractPopover.propTypes.attachment,
    placements: AbstractPopover.propTypes.placements
  }),
  drawerProps: PropTypes.shape({
    position: Drawer.propTypes.position
  })
}

export default ObservedDropdown
