import React, { useState, useRef, useImperativeHandle, useEffect } from 'react'
import {
  Dimensions,
  UIManager,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { pug, observer, $ } from 'startupjs'
import PropTypes from 'prop-types'
import DropdownCaption from './components/Caption'
import DropdownItem from './components/Item'
import { useKeyboard } from './helpers'
import Drawer from '../Drawer'
import Popover from '../Popover'
import CONSTANTS from '../Popover/constants.json'
import themed from '../../../theming/themed'
import STYLES from './index.styl'

const { PLACEMENTS_ORDER } = CONSTANTS

// TODO: key event change scroll
function Dropdown ({
  style,
  captionStyle,
  activeItemStyle,
  children,
  value,
  position,
  attachment,
  placements,
  drawerVariant,
  drawerListTitle,
  drawerCancelLabel,
  disabled,
  hasDrawer,
  showDrawerResponder,
  onChange,
  onDismiss
}, ref) {
  const refScroll = useRef()
  const renderContent = useRef([])

  const $isShow = $(false)
  const [activeInfo, setActiveInfo] = useState(null)
  const $layoutWidth = $(
    Math.min(Dimensions.get('window').width, Dimensions.get('screen').width)
  )
  const [selectIndexValue] = useKeyboard({
    value,
    isShow: $isShow.get(),
    renderContent,
    onChange,
    onChangeShow: v => $isShow.set(v)
  })
  const isPopover = !hasDrawer || ($layoutWidth.get() > STYLES.media.tablet)

  function handleWidthChange () {
    $isShow.set(false)
    $layoutWidth.set(Math.min(Dimensions.get('window').width, Dimensions.get('screen').width))
  }

  useEffect(() => {
    const listener = Dimensions.addEventListener('change', handleWidthChange)

    return () => {
      $isShow.del()

      if (Dimensions.removeEventListener) {
        Dimensions.removeEventListener('change', handleWidthChange)
      } else {
        listener?.remove()
      }
    }
  }, [])

  useImperativeHandle(ref, () => ({
    open: () => {
      $isShow.set(true)
    },
    close: () => {
      $isShow.set(false)
    }
  }))

  function onLayoutActive ({ nativeEvent }) {
    setActiveInfo(nativeEvent.layout)
  }

  function onCancel () {
    onDismiss && onDismiss()
    $isShow.set(false)
  }

  function onRequestOpen () {
    UIManager.measure(refScroll.current.getScrollableNode(), (x, y, width, curHeight) => {
      if (activeInfo && activeInfo.y >= (curHeight - activeInfo.height)) {
        refScroll.current.scrollTo({ y: activeInfo.y, animated: false })
      }
    })
  }

  let caption = null
  let activeLabel = ''
  renderContent.current = []
  React.Children.toArray(children).forEach((child, index, arr) => {
    if (child.type === DropdownCaption) {
      if (index !== 0) Error('Caption need use first child')
      if (child.props.children) {
        caption = React.cloneElement(child, { variant: 'custom' })
      } else {
        caption = child
      }
      return
    }

    const _child = React.cloneElement(child, {
      _variant: child.props.children
        ? 'pure'
        : (isPopover ? 'popover' : drawerVariant),
      _styleActiveItem: activeItemStyle,
      _activeValue: value,
      _selectIndexValue: selectIndexValue,
      _index: caption ? (index - 1) : index,
      _childrenLength: caption ? (arr.length - 1) : arr.length,
      _onDismissDropdown: () => $isShow.set(false),
      _onChange: v => {
        onChange && onChange(v)
        $isShow.set(false)
      }
    })

    if (value === child.props.value) {
      activeLabel = child.props.label
      renderContent.current.push(pug`
        View(
          key=index
          value=child.props.value
          onLayout=onLayoutActive
        )=_child
      `)
    } else {
      renderContent.current.push(_child)
    }
  })

  if (!caption) {
    caption = <DropdownCaption _activeLabel={activeLabel} />
  } else {
    caption = React.cloneElement(caption, { _activeLabel: activeLabel })
  }

  const _popoverStyle = StyleSheet.flatten(style)
  if (caption.props.variant === 'button' || caption.props.variant === 'custom') {
    _popoverStyle.minWidth = 160
  }

  if (isPopover) {
    return pug`
      Popover.popover(
        ref=refScroll
        captionStyle=captionStyle
        style=_popoverStyle
        position=position
        attachment=attachment
        placements=placements
        visible=$isShow.get()
        hasWidthCaption=(!_popoverStyle.width && !_popoverStyle.minWidth)
        onDismiss=()=> $isShow.set(false)
        onRequestOpen=onRequestOpen
      )
        if caption
          Popover.Caption
            TouchableOpacity(
              disabled=disabled
              onPress=() => $isShow.set(!$isShow.get())
            )
              = caption
        = renderContent.current
    `
  }

  return pug`
    if caption
      TouchableOpacity.caption(
        disabled=disabled
        onPress=() => $isShow.set(!$isShow.get())
      )
        = caption
    Drawer(
      visible=$isShow.get()
      position='bottom'
      style={ maxHeight: '100%' }
      styleName={ drawerReset: drawerVariant === 'buttons' }
      onDismiss=()=> $isShow.set(false)
      onRequestOpen=onRequestOpen
      showResponder=showDrawerResponder
    )
      View.dropdown(styleName=drawerVariant)
        if drawerVariant === 'list'
          View.caption(styleName=drawerVariant)
            Text.captionText(styleName=drawerVariant)= drawerListTitle
        ScrollView.case(
          ref=refScroll
          showsVerticalScrollIndicator=false
          style=_popoverStyle
          styleName=drawerVariant
        )= renderContent.current
        if drawerVariant === 'buttons'
          TouchableOpacity(onPress=onCancel)
            View.button(styleName=drawerVariant)
              Text= drawerCancelLabel
  `
}

Dropdown.defaultProps = {
  style: [],
  position: 'bottom',
  attachment: 'start',
  value: '',
  drawerVariant: 'buttons',
  drawerListTitle: '',
  drawerCancelLabel: 'Cancel',
  hasDrawer: true
}

Dropdown.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  activeItemStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  attachment: PropTypes.oneOf(['start', 'center', 'end']),
  placements: PropTypes.oneOf(PLACEMENTS_ORDER),
  drawerVariant: PropTypes.oneOf(['list', 'buttons', 'pure']),
  drawerListTitle: PropTypes.string,
  drawerCancelLabel: PropTypes.string,
  hasDrawer: PropTypes.bool,
  onChange: PropTypes.func,
  onDismiss: PropTypes.func
}

const ObservedDropdown = observer(
  themed('Dropdown', Dropdown),
  { forwardRef: true }
)

ObservedDropdown.Caption = DropdownCaption
ObservedDropdown.Item = DropdownItem

export default ObservedDropdown
