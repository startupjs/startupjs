import React, { useLayoutEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Picker,
  Text,
  View,
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions
} from 'react-native'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import Icon from '../../Icon'
import Drawer from '../Drawer'
import Popover from '../Popover'
import './index.styl'

// TODO: add system variant
// scroll to active element
const Dropdown = ({
  titleDefault,
  hasPopoverWidthCaption,
  styleWrapper,
  styleActiveItem,
  popoverHeight,
  activeValue,
  variant,
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
  const isPopover = (variant === 'system' && Platform.OS === 'web') || layoutWidth > 780

  let caption = null
  let renderContent = []
  React.Children.toArray(children).forEach((child, index, arr) => {
    if (child.type === Dropdown.Caption) {
      if (index !== 0) {
        Error('Caption need use first child')
      }
      caption = child.props.children
      return
    }

    renderContent.push(
      React.cloneElement(child, {
        _variant: isPopover ? 'popover' : variant,
        _isCustom: variant === 'custom',
        _styleActiveItem: styleActiveItem,
        _active: activeValue,
        _index: caption ? index - 1 : index,
        _childenLength: caption ? arr.length - 1 : arr.length,
        _onDismiss: () => setIsShow(false),
        _onChange: value => {
          onChange(value)
          setIsShow(false)
        }
      })
    )
  })

  if (isPopover) {
    return pug`
      Popover(
        visible=isShow
        onDismiss=()=> setIsShow(false)
        height=popoverHeight || 0
        hasWidthCaption=hasPopoverWidthCaption
        styleWrapper=styleWrapper
      )
        if caption
          Popover.Caption
            TouchableOpacity(onPress=()=> setIsShow(true))
              = caption
        ScrollView
          = renderContent
    `
  }

  // TODO: variant system
  if (variant === 'system') {
    const Wrapper = Platform.OS === 'ios' ? Drawer : View
    const wrapperProps = Platform.OS === 'ios' ? {
      visible: isShow,
      onDismiss,
      position: 'bottom',
      hasDefaultStyleContent: false
    } : {}

    return pug`
      Wrapper(...wrapperProps)
        View.dropdown(styleName=variant)
          if Platform.OS === 'ios'
            View.systemMenu
              Text Cancel
          Picker(selectedValue='java' mode='dropdown')
            Picker.Item(label='Java' value='java')
            Picker.Item(label='JavaScript' value='js')
            Picker.Item(label='JavaScript' value='js2')
            Picker.Item(label='JavaScript' value='js3')
    `
  }
  // TODO ---------------------

  return pug`
    if caption
      TouchableOpacity(onPress=()=> setIsShow(true))
        = caption
    Drawer(
      visible=isShow
      onDismiss=()=> setIsShow(false)
      position='bottom'
      isSwipe=false
      hasDefaultStyleContent=variant === 'default'
    )
      View.dropdown(styleName=variant)
        if variant === 'default'
          View.caption(styleName=variant)
            Text.captionText(styleName=variant)= titleDefault
        View.case(styleName=variant)
          = renderContent
        if variant === 'buttons'
          TouchableOpacity(onPress=onDismiss)
            View.button(styleName=variant)
              Text Отмена
  `
}

Dropdown.defaultProps = {
  titleDefault: '',
  activeValue: '',
  variant: 'default',
  hasPopoverWidthCaption: true
}

Dropdown.propTypes = {
  variant: PropTypes.oneOf(['default', 'buttons', 'system', 'custom']),
  activeValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  popoverHeight: PropTypes.number
}

Dropdown.Caption = ({ children }) => pug`= children`
Dropdown.Item = ({
  label,
  value,
  onPress,
  children,
  _isCustom,
  _active,
  _variant,
  _onChange,
  _onDismiss,
  _index,
  _childenLength
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress()
      _onDismiss()
    } else {
      _onChange(value)
    }
  }

  return pug`
    TouchableOpacity(onPress=handlePress)
      View.item(styleName=[!_isCustom && _variant, {
        active: !_isCustom && (_active === value),
        itemUp: !_isCustom && (_index === 0),
        itemDown: !_isCustom && (_index === _childenLength - 1)
      }])
        if _isCustom
          = children
        else
          Text.itemText(styleName=[_variant, { active: _active && _active === value }])
            = label
          if _active === value && _variant !== 'popover'
            Icon.iconActive(styleName=_variant icon=faCheck)
  `
}

export default Dropdown
