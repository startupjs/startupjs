import React, { useContext } from 'react'
import { NativeModules, Platform } from 'react-native'
import { observer } from 'startupjs'
import { TextInput, ScrollPageContext } from '@startupjs/ui'
import MultiSelect from './MultiSelect'

const { UIManager } = NativeModules

const DRAWER_HEIGHT = Platform.OS === 'iod' ? 460 : 160
const OFFSET_POSITION = 100

export default observer(function Caption ({
  style,
  multiselect,
  value,
  isShow,
  inputValue,
  placeholder,
  label,
  description,
  disabled,
  size,
  testID,
  renderTag,
  onKeyPress,
  onSelect,
  onChange,
  onChangeText,
  onChangeShow
}, ref) {
  const scrollPage = useContext(ScrollPageContext)

  function onFocus () {
    ref.current.measure((x, y, width, height, pageX, pageY) => {
      UIManager.measure(scrollPage.current.getScrollableNode(), (sx, sy, sWidth, sHeight, sPageX, sPageY) => {
        if (pageY - sPageY + height + DRAWER_HEIGHT > sHeight) {
          scrollPage.current.scrollTo({
            y: (pageY + scrollPage.current.scrollPosition) - sPageY - OFFSET_POSITION,
            animated: true
          })
        }

        onChangeShow(true)
      })
    })
  }

  return pug`
    if multiselect
      MultiSelect(
        ref=ref
        value=value
        isShow=isShow
        placeholder=placeholder
        inputValue=inputValue
        renderTag=renderTag
        testID=testID
        onChangeText=onChangeText
        onChangeShow=onChangeShow
        onChange=onChange
        onKeyPress=onKeyPress
      )
    else
      TextInput(
        ref=ref
        value=(!isShow && value.label) || inputValue
        style=style
        placeholder=placeholder
        label=label
        description=description
        disabled=disabled
        size=size
        testID=testID
        onChangeText=onChangeText
        onFocus=onFocus
        onKeyPress=onKeyPress
      )
  `
}, { forwardRef: true })
