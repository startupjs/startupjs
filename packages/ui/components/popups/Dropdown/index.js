import React, { useLayoutEffect, useState, useRef, useEffect } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
  Platform
} from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Drawer from '../Drawer'
import Popover from '../Popover'
import DropdownCaption from './Caption'
import DropdownItem from './Item'
import { PLACEMENTS_ORDER } from '../Popover/constants'
import './index.styl'

// TODO: key event change scroll
function Dropdown ({
  children,
  activeItemStyle,
  popoverWrapperStyle,
  value,
  position,
  attachment,
  placements,
  drawerVariant,
  drawerListTitle,
  drawerCancelLabel,
  onChange,
  onDismiss
}) {
  const refScroll = useRef()
  const [selectIndexValue, setSelectIndexValue] = useState(-1)
  const [layoutWidth, setLayoutWidth] = useState(null)
  const [isShow, setIsShow] = useState(false)
  const [activePosition, setActivePosition] = useState(null)
  const isPopover = layoutWidth > 780

  useLayoutEffect(() => {
    if (!layoutWidth) handleWidthChange()
    Dimensions.addEventListener('change', handleWidthChange)
    return () => Dimensions.removeEventListener('change', handleWidthChange)
  }, [])
  const handleWidthChange = () => {
    setLayoutWidth(Math.min(Dimensions.get('window').width, Dimensions.get('screen').width))
  }

  useEffect(() => {
    if (Platform.OS !== 'web') return

    if (isShow) {
      document.addEventListener('keydown', onKeyDown)
    } else {
      document.removeEventListener('keydown', onKeyDown)
      setSelectIndexValue(-1)
    }

    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isShow, selectIndexValue])

  function onLayoutActive ({ nativeEvent }) {
    setActivePosition(nativeEvent.layout.y)
  }

  function onCancel () {
    onDismiss && onDismiss()
    setIsShow(false)
  }

  const _popoverWrapperStyle = StyleSheet.flatten(popoverWrapperStyle)

  function onRequestOpen () {
    const curHeight = _popoverWrapperStyle.maxHeight || _popoverWrapperStyle.height
    if (activePosition >= curHeight) {
      refScroll.current.scrollTo({ y: activePosition })
    }
  }

  let caption = null
  let renderContent = []
  let activeLabel = ''
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
      renderContent.push(pug`
        View(
          key=index
          value=child.props.value
          onLayout=onLayoutActive
        )=_child
      `)
    } else {
      renderContent.push(_child)
    }
  })

  if (!caption) {
    caption = <DropdownCaption _activeLabel={activeLabel} />
  } else {
    caption = React.cloneElement(caption, { _activeLabel: activeLabel })
  }

  function onKeyDown (e) {
    e.preventDefault()
    e.stopPropagation()

    let item, index
    const keyName = e.key

    switch (keyName) {
      case 'ArrowUp':
        if (selectIndexValue === 0 || (selectIndexValue === -1 && !value)) return

        index = selectIndexValue - 1
        if (selectIndexValue === -1 && value) {
          index = renderContent.findIndex(item => item.props.value === value)
          index--
        }

        setSelectIndexValue(index)
        break

      case 'ArrowDown':
        if (selectIndexValue === renderContent.length - 1) return

        index = selectIndexValue + 1
        if (selectIndexValue === -1 && value) {
          index = renderContent.findIndex(item => item.props.value === value)
          index++
        }

        setSelectIndexValue(index)
        break

      case 'Enter':
        if (selectIndexValue === -1) return
        item = renderContent.find((_, i) => i === selectIndexValue)
        onChange && onChange(item.props.value)
        break
    }
  }

  if (isPopover) {
    return pug`
      Popover(
        wrapperStyleName='wrapper'
        wrapperStyle=_popoverWrapperStyle
        position=position
        attachment=attachment
        placements=placements
        visible=isShow
        hasWidthCaption=!_popoverWrapperStyle.width
        onDismiss=()=> setIsShow(false)
        onRequestOpen=onRequestOpen
      )
        if caption
          Popover.Caption
            TouchableOpacity(onPress=()=> setIsShow(!isShow))
              = caption
        ScrollView(ref=refScroll)
          = renderContent
    `
  }

  return pug`
    if caption
      TouchableOpacity(onPress=()=> setIsShow(!isShow))
        = caption
    Drawer(
      visible=isShow
      position='bottom'
      hasDefaultStyleContent=drawerVariant === 'list'
      onDismiss=()=> setIsShow(false)
    )
      View.dropdown(styleName=drawerVariant)
        if drawerVariant === 'list'
          View.caption(styleName=drawerVariant)
            Text.captionText(styleName=drawerVariant)= drawerListTitle
        View.case(styleName=drawerVariant)
          = renderContent
        if drawerVariant === 'buttons'
          TouchableOpacity(onPress=onCancel)
            View.button(styleName=drawerVariant)
              Text= drawerCancelLabel
  `
}

Dropdown.defaultProps = {
  popoverWrapperStyle: [],
  position: 'bottom',
  attachment: 'center',
  value: '',
  drawerVariant: 'buttons',
  drawerListTitle: '',
  drawerCancelLabel: 'Cancel'
}

Dropdown.propTypes = {
  popoverWrapperStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  activeItemStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  attachment: PropTypes.oneOf(['start', 'center', 'end']),
  placements: PropTypes.oneOf(PLACEMENTS_ORDER),
  drawerVariant: PropTypes.oneOf(['list', 'buttons', 'pure']),
  drawerListTitle: PropTypes.string,
  drawerCancelLabel: PropTypes.string,
  hasPopoverWidthCaption: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onDismiss: PropTypes.func
}

const ObservedDropdown = observer(Dropdown)
ObservedDropdown.Caption = DropdownCaption
ObservedDropdown.Item = DropdownItem
export default ObservedDropdown
