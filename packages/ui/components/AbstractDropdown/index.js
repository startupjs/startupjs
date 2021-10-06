import React, { useRef, useImperativeHandle } from 'react'
import { FlatList, TouchableOpacity } from 'react-native'
import { observer, useValue } from 'startupjs'
import { useMedia } from '@startupjs/ui'
import PropTypes from 'prop-types'
import Item from '../Item'
import H5 from '../typography/headers/H5'
import AbstractPopover from '../AbstractPopover'
import Drawer from '../popups/Drawer'
import { ContentPopover, ContentDrawer } from './components'
import { useKeyboard, useScroll } from './helpers'
import './index.styl'

function AbstractDropdown ({
  style,
  children,
  refAnchor,
  value,
  options,
  renderItem,
  popoverOnly,
  popoverProps,
  drawerProps,
  onChange,
  ...props
}, ref) {
  const media = useMedia()
  const isDrawer = !media.tablet && !popoverOnly

  const refScroll = useRef()
  const [visible, $visible] = useValue(false)

  const [selectIndex] = useKeyboard({
    visible,
    value,
    options,
    onChange: _onChange
  })

  const {
    getItemLayout,
    scrollToActive,
    onLayoutItem
  } = useScroll({ refScroll, value, options })

  useImperativeHandle(ref, () => ({
    open: () => $visible.setDiff(true),
    close: () => $visible.setDiff(false)
  }))

  function _onChange (value) {
    $visible.set(false)
    onChange && onChange(value)
  }

  function _renderItem ({ item, index }) {
    if (renderItem) {
      return pug`
        TouchableOpacity(
          key=index
          onPress=()=> _onChange(item)
        )= renderItem({ item, index, selectIndex })
      `
    }

    return pug`
      Item(
        to=item.to
        icon=item.icon
        active=value.value === item.value
        styleName={
          drawerItem: isDrawer,
          selectItem: index === selectIndex
        }
        containerStyleName={ drawerItemContainer: isDrawer }
        onLayout=e=> onLayoutItem(e, index)
        onPress=()=> item.onPress ? item.onPress() : _onChange(item)
      )= item.label
    `
  }

  function renderContent () {
    return pug`
      if isDrawer
        H5.drawerCaption(bold)= drawerProps.listTitle
      FlatList(
        ref=refScroll
        data=options
        extraData={ selectIndex }
        renderItem=_renderItem
        keyExtractor=item=> item.value
        getItemLayout=getItemLayout
        scrollEventThrottle=500
      )
    `
  }

  if (isDrawer) {
    return pug`
      ContentDrawer(
        ...drawerProps
        visible=visible
        renderContent=renderContent
        onChangeVisible=v=> $visible.set(v)
        onRequestOpen=scrollToActive
      )= children
    `
  }

  return pug`
    ContentPopover(
      ...popoverProps
      visible=visible
      refAnchor=refAnchor
      renderContent=renderContent
      onChangeVisible=v=> $visible.set(v)
      onRequestOpen=scrollToActive
    )= children
  `
}

const ObservedDropdown = observer(AbstractDropdown, { forwardRef: true })

ObservedDropdown.defaultProps = {
  value: '',
  popoverOnly: false,
  popoverProps: {
    position: 'bottom',
    attachment: 'start',
    placements: AbstractPopover.defaultProps.placements
  },
  drawerProps: {
    position: 'bottom',
    listTitle: 'Select value'
  }
}

ObservedDropdown.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  popoverOnly: PropTypes.bool,
  popoverProps: PropTypes.shape({
    position: AbstractPopover.propTypes.position,
    attachment: AbstractPopover.propTypes.attachment,
    placements: AbstractPopover.propTypes.placements
  }),
  drawerProps: PropTypes.shape({
    position: Drawer.propTypes.position,
    listTitle: PropTypes.string
  }),
  onChange: PropTypes.func
}

export default ObservedDropdown
