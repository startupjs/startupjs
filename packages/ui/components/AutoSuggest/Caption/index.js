import React, { useContext } from 'react'
import { NativeModules, Platform } from 'react-native'
import { observer } from 'startupjs'
import { TextInput, ScrollPageContext } from '@startupjs/ui'
import MultiSelect from './MultiSelect'

const { UIManager } = NativeModules

const DRAWER_HEIGHT = Platform.OS === 'ios' ? 460 : 160
const OFFSET_POSITION = 50

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

  async function onFocus () {
    if (Platform.OS === 'android') {
      await new Promise(resolve => setTimeout(() => resolve(), 100))
    }

    ref.current.measure((x, y, w, inputHeight, px, inputPageY) => {
      UIManager.measure(scrollPage.current.getScrollableNode(), (sx, sy, sw, scrollWrapperHeight, spx, scrollWrapperPageY) => {
        const inputInScrollPageY = inputPageY - scrollWrapperPageY
        const inputBottomPointY = inputInScrollPageY + inputHeight

        if (inputBottomPointY + DRAWER_HEIGHT > scrollWrapperHeight) {
          scrollPage.current.scrollTo({
            y: inputInScrollPageY + scrollPage.current.scrollPosition - OFFSET_POSITION,
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
