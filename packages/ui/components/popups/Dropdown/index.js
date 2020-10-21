import React, { useLayoutEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  NativeModules
} from 'react-native'
import Drawer from '../Drawer'
import Popover from '../Popover'
import DropdownCaption from './Caption'
import DropdownItem from './Item'
import { u, observer } from 'startupjs'
import './index.styl'

const { UIManager } = NativeModules

const DEFAULT_STYLE_WRAPPER = {
  borderRadius: u(0.5)
}

function Dropdown ({
  drawerListTitle,
  drawerVariant,
  hasMobileDrawer,
  popoverWidth,
  popoverHeight,
  popoverMaxHeight,
  popoverStyleWrapper,
  styleActiveItem,
  activeValue,
  onChange,
  onDismiss,
  children
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

    if (activeValue === child.props.value) {
      activeLabel = child.props.label
      renderContent.push(<View onLayout={onLayoutActive}>{_child}</View>)
    } else {
      renderContent.push(_child)
    }
  })

  const onCancel = () => {
    onDismiss && onDismiss()
    setIsShow(false)
  }

  const onRequestOpen = () => {
    UIManager.measure(refScroll.current.getInnerViewNode(), (x, y) => {
      if (activePosition >= popoverHeight) {
        refScroll.current.scrollTo({ y: activePosition })
      }
    })
  }

  const _popoverStyleWrapper = {
    ...DEFAULT_STYLE_WRAPPER,
    ...popoverStyleWrapper
  }

  if (!caption) {
    caption = <DropdownCaption _activeLabel={activeLabel} />
  } else {
    caption = React.cloneElement(caption, { _activeLabel: activeLabel })
  }

  if (isPopover) {
    return pug`
      Popover(
        visible=isShow
        onDismiss=()=> setIsShow(false)
        onRequestOpen=onRequestOpen
        maxHeight=popoverMaxHeight
        height=popoverHeight
        width=popoverWidth
        hasWidthCaption=!popoverWidth
        styleWrapper=_popoverStyleWrapper
        shadowLevel=2
      )
        if caption
          Popover.Caption
            TouchableOpacity(onPress=()=> setIsShow(true))
              = caption
        ScrollView(ref=refScroll)
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
  popoverStyleWrapper: {}
}

Dropdown.propTypes = {
  activeValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  drawerVariant: PropTypes.oneOf(['list', 'buttons', 'pure']),
  popoverHeight: PropTypes.number,
  hasMobileDrawer: PropTypes.bool,
  hasPopoverWidthCaption: PropTypes.bool
}

const ObservedDropdown = observer(Dropdown)
ObservedDropdown.Caption = DropdownCaption
ObservedDropdown.Item = DropdownItem
export default ObservedDropdown
