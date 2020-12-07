import React, { useLayoutEffect, useState, useRef } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  NativeModules,
  StyleSheet
} from 'react-native'
import { observer } from 'startupjs'
import PropTypes from 'prop-types'
import Drawer from '../Drawer'
import Popover from '../Popover'
import DropdownCaption from './Caption'
import DropdownItem from './Item'
import { PLACEMENTS_ORDER } from '../Popover/constants'
import './index.styl'

const { UIManager } = NativeModules

function Dropdown ({
  style,
  activeItemStyle,
  children,
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
  const [layoutWidth, setLayoutWidth] = useState(null)
  useLayoutEffect(() => {
    if (!layoutWidth) handleWidthChange()
    Dimensions.addEventListener('change', handleWidthChange)
    return () => Dimensions.removeEventListener('change', handleWidthChange)
  }, [])
  const handleWidthChange = () => {
    setLayoutWidth(Math.min(Dimensions.get('window').width, Dimensions.get('screen').width))
  }

  const refScroll = useRef()
  const [activePosition, setActivePosition] = useState(null)
  const [isShow, setIsShow] = useState(false)
  const isPopover = layoutWidth > 780

  const onLayoutActive = ({ nativeEvent }) => {
    setActivePosition(nativeEvent.layout.y)
  }

  const _popoverWrapperStyle = StyleSheet.flatten(popoverWrapperStyle)

  const onCancel = () => {
    onDismiss && onDismiss()
    setIsShow(false)
  }

  const _wrapperStyle = StyleSheet.flatten(style)

  function onRequestOpen () {
    const curHeight = _wrapperStyle.maxHeight || _wrapperStyle.height
    if (activePosition >= curHeight - 10) {
      refScroll.current.scrollTo({ y: activePosition, animated: false })
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
      renderContent.push(<View onLayout={onLayoutActive}>{_child}</View>)
    } else {
      renderContent.push(_child)
    }
  })

  if (!caption) {
    caption = <DropdownCaption _activeLabel={activeLabel} />
  } else {
    caption = React.cloneElement(caption, { _activeLabel: activeLabel })
  }

  if (isPopover) {
    return pug`
      Popover(
        wrapperStyleName='wrapper'
        wrapperStyle=_wrapperStyle
        position=position
        attachment=attachment
        placements=placements
        visible=isShow
        hasWidthCaption=!_wrapperStyle.width
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
      onRequestOpen=onRequestOpen
    )
      View.dropdown(styleName=drawerVariant)
        if drawerVariant === 'list'
          View.caption(styleName=drawerVariant)
            Text.captionText(styleName=drawerVariant)= drawerListTitle
        ScrollView.case(
          ref=refScroll
          showsVerticalScrollIndicator=false
          style=_wrapperStyle
          styleName=drawerVariant
        )= renderContent
        if drawerVariant === 'buttons'
          TouchableOpacity(onPress=onCancel)
            View.button(styleName=drawerVariant)
              Text= drawerCancelLabel
  `
}

Dropdown.defaultProps = {
  style: [],
  position: 'bottom',
  attachment: 'center',
  value: '',
  drawerVariant: 'buttons',
  drawerListTitle: '',
  drawerCancelLabel: 'Cancel'
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
  hasPopoverWidthCaption: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onDismiss: PropTypes.func
}

const ObservedDropdown = observer(Dropdown)
ObservedDropdown.Caption = DropdownCaption
ObservedDropdown.Item = DropdownItem
export default ObservedDropdown
