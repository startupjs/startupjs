import React, { useLayoutEffect, useState } from 'react'
import propTypes from 'prop-types'
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from 'react-native'
import Drawer from '../Drawer'
import Popover from '../Popover'
import DropdownCaption from './Caption'
import DropdownItem from './Item'
import config from '../../../config/rootConfig'
import { u } from 'startupjs'
import './index.styl'

const DEFAULT_STYLE_WRAPPER = {
  transform: [{ translateY: 3 }],
  borderRadius: u(0.5),
  ...config.shadows[2]
}

// TODO: scroll to active element
const Dropdown = ({
  drawerListTitle,
  drawerVariant,
  hasMobileDrawer,
  popoverWidth,
  popoverHeight,
  popoverStyleWrapper,
  styleActiveItem,
  activeValue,
  onChange,
  onDismiss,
  children
}) => {
  const [layoutWidth, setLayoutWidth] = useState(null)
  useLayoutEffect(() => {
    if (!layoutWidth) handleWidthChange()
    Dimensions.addEventListener('change', handleWidthChange)
    return () => Dimensions.removeEventListener('change', handleWidthChange)
  }, [])
  const handleWidthChange = () => {
    setLayoutWidth(Math.min(Dimensions.get('window').width, Dimensions.get('screen').width))
  }

  const [isShow, setIsShow] = useState(false)
  const isPopover = layoutWidth > 780

  let caption = null
  let renderContent = []
  let activeLabel = ''
  React.Children.toArray(children).forEach((child, index, arr) => {
    if (child.type.toString() === Dropdown.Caption.toString()) {
      if (index !== 0) Error('Caption need use first child')
      if (child.props.children) {
        caption = React.cloneElement(child, { variant: 'custom' })
      } else {
        caption = child
      }
      return
    }

    if (activeValue === child.props.value) {
      activeLabel = child.props.label
    }

    renderContent.push(
      React.cloneElement(child, {
        _variant: isPopover ? 'popover' : drawerVariant,
        _isPure: !!child.props.children,
        _styleActiveItem: styleActiveItem,
        _activeValue: activeValue,
        _index: caption ? index - 1 : index,
        _childenLength: caption ? arr.length - 1 : arr.length,
        _onDismissDropdown: () => setIsShow(false),
        _onChange: value => {
          onChange(value)
          setIsShow(false)
        }
      })
    )
  })
  if (!caption) caption = <DropdownCaption _activeLabel={activeLabel} />

  const onCancel = () => {
    onDismiss && onDismiss()
    setIsShow(false)
  }

  const _popoverStyleWrapper = {
    ...DEFAULT_STYLE_WRAPPER,
    ...popoverStyleWrapper
  }

  if (isPopover) {
    return pug`
      Popover(
        visible=isShow
        onDismiss=()=> setIsShow(false)
        height=popoverHeight
        width=popoverWidth
        hasWidthCaption=!popoverWidth
        styleWrapper=_popoverStyleWrapper
      )
        if caption
          Popover.Caption
            TouchableOpacity(onPress=()=> setIsShow(true))
              = caption
        ScrollView
          = renderContent
    `
  }

  return pug`
    if caption
      TouchableOpacity(onPress=()=> setIsShow(true))
        = caption
    Drawer(
      visible=isShow
      onDismiss=()=> setIsShow(false)
      position='bottom'
      isSwipe=false
      hasDefaultStyleContent=drawerVariant === 'list'
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
              Text Отмена
  `
}

Dropdown.defaultProps = {
  drawerVariant: 'buttons',
  drawerListTitle: '',
  activeValue: '',
  hasMobileDrawer: true,
  popoverHeight: 96,
  popoverStyleWrapper: {}
}

Dropdown.propTypes = {
  activeValue: propTypes.oneOfType([propTypes.string, propTypes.number]).isRequired,
  onChange: propTypes.func.isRequired,
  drawerVariant: propTypes.oneOf(['list', 'buttons', 'pure']),
  popoverHeight: propTypes.number,
  hasMobileDrawer: propTypes.bool,
  hasPopoverWidthCaption: propTypes.bool
}

Dropdown.Caption = DropdownCaption
Dropdown.Item = DropdownItem

export default Dropdown
