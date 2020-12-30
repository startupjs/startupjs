import React, { useState, useRef, useImperativeHandle } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  NativeModules
} from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import DropdownCaption from './components/Caption'
import DropdownItem from './components/Item'
import { useLayoutSize, useKeyboard } from './helpers'
import Drawer from '../Drawer'
import Popover from '../Popover'
import { PLACEMENTS_ORDER } from '../Popover/constants'
import STYLES from './index.styl'

const { UIManager } = NativeModules

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
  hasDrawer,
  onChange,
  onDismiss
}, ref) {
  const refScroll = useRef()
  const renderContent = useRef([])

  const [isShow, setIsShow] = useState(false)
  const [activeInfo, setActiveInfo] = useState(null)
  const [layoutWidth] = useLayoutSize()
  const [selectIndexValue] = useKeyboard({
    value,
    isShow,
    renderContent,
    onChange,
    onChangeShow: v => setIsShow(v)
  })
  const isPopover = !hasDrawer || (layoutWidth > STYLES.media.tablet)

  useImperativeHandle(ref, () => ({
    open: () => {
      setIsShow(true)
    },
    close: () => {
      setIsShow(false)
    }
  }))

  function onLayoutActive ({ nativeEvent }) {
    setActiveInfo(nativeEvent.layout)
  }

  function onCancel () {
    onDismiss && onDismiss()
    setIsShow(false)
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
      _childenLength: caption ? (arr.length - 1) : arr.length,
      _onDismissDropdown: () => setIsShow(false),
      _onChange: v => {
        onChange(v)
        setIsShow(false)
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
      Popover(
        ref=refScroll
        styleName='popover'
        contentStyleName='content'
        captionStyle=captionStyle
        style=_popoverStyle
        position=position
        attachment=attachment
        placements=placements
        visible=isShow
        hasWidthCaption=(!_popoverStyle.width && !_popoverStyle.minWidth)
        onDismiss=()=> setIsShow(false)
        onRequestOpen=onRequestOpen
      )
        if caption
          Popover.Caption
            TouchableOpacity(onPress=()=> setIsShow(!isShow))
              = caption
        = renderContent.current
    `
  }

  return pug`
    if caption
      TouchableOpacity.caption(onPress=()=> setIsShow(!isShow))
        = caption
    Drawer(
      visible=isShow
      position='bottom'
      style={ maxHeight: '100%' }
      styleName={ drawerReset: drawerVariant === 'buttons' }
      onDismiss=()=> setIsShow(false)
      onRequestOpen=onRequestOpen
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

const ObservedDropdown = observer(Dropdown, { forwardRef: true })

ObservedDropdown.defaultProps = {
  style: [],
  position: 'bottom',
  attachment: 'start',
  value: '',
  drawerVariant: 'buttons',
  drawerListTitle: '',
  drawerCancelLabel: 'Cancel',
  hasDrawer: true
}

ObservedDropdown.propTypes = {
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
  onChange: PropTypes.func.isRequired,
  onDismiss: PropTypes.func
}

ObservedDropdown.Caption = DropdownCaption
ObservedDropdown.Item = DropdownItem
export default ObservedDropdown
