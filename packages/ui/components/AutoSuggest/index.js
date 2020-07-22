import React, { useState, useEffect } from 'react'
import { ScrollView } from 'react-native'
import TextInput from '../forms/TextInput'
import Popover from '../popups/Popover'
import Menu from '../Menu'
import propTypes from 'prop-types'

const AutoSuggest = ({
  data,
  placeholder,
  popoverHeight,
  renderItem,
  value,
  onChange
}) => {
  const [firstItem, setFirstItem] = useState({})
  const [isFind, setIsFind] = useState(false)
  const onFocus = () => setIsFind(true)
  const onBlur = () => setIsFind(false)

  let _data = data.filter((item, index) => {
    if (item.label === value) return
    return value ? !!item.label.match(new RegExp('^' + value, 'gi')) : true
  }).splice(0, 30)

  const renderItems = _data.map((item, index) => {
    if (renderItem) return renderItem(item, index, item.label === value)
    return pug`
      Menu.Item(
        key=index
        onPress=()=> onChange(item.label, item)
        active=item.label === value
      )= item.label
    `
  })

  useEffect(() => {
    setFirstItem(_data[0])
  }, [JSON.stringify(_data)])

  return pug`
    Popover(
      height=popoverHeight
      visible=(!!_data.length && isFind)
      positionHorizontal="right"
      onDismiss=()=> {}
    )
      Popover.Caption
        TextInput(
          placeholder=placeholder
          onFocus=onFocus
          onBlur=onBlur
          onChangeText=t=> onChange(t, firstItem)
          value=value
        )
      ScrollView
        Menu= renderItems
  `
}

AutoSuggest.defaultProps = {
  data: [],
  placeholder: 'Select value',
  popoverHeight: 300,
  value: ''
}

AutoSuggest.propTypes = {
  placeholder: propTypes.string,
  popoverHeight: propTypes.number,
  value: propTypes.oneOfType([propTypes.string, propTypes.number]),
  data: propTypes.array,
  renderItem: propTypes.func,
  onChange: propTypes.func
}

export default AutoSuggest
