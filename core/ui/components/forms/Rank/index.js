import React, { useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { pug, observer, $root, useValue } from 'startupjs'
import PropTypes from 'prop-types'
import { faGripVertical } from '@fortawesome/free-solid-svg-icons/faGripVertical'
import DragDropProvider from '../../draggable/DragDropProvider'
import Draggable from '../../draggable/Draggable'
import Droppable from '../../draggable/Droppable'
import Span from '../../typography/Span'
import Icon from '../../Icon'
import Input from '../Input'
import Div from '../../Div'
import { useColors } from '../../../hooks'
import { getOptionValue, getOptionLabel, stringifyValue, move } from './helpers'
import STYLES from './index.styl'

function Rank (props) {
  let { options, readonly, value, style } = props

  value = useMemo(() => {
    return options.slice().sort((a, b) => {
      return value.findIndex(i => stringifyValue(i) === stringifyValue(a)) -
        value.findIndex(i => stringifyValue(i) === stringifyValue(b))
    })
  }, [value.toString()])

  return pug`
    if readonly
      RankReadonly(value=value style=style)
    else
      RankInput(...props value=value)
  `
}

const RankInput = observer(function ({
  value,
  onChange,
  disabled,
  style
}) {
  const [width, $width] = useValue()
  const dropId = useMemo(() => $root.id(), [])

  const getColor = useColors()

  const selectOptions = useMemo(() => {
    return value.map((o, i) => ({ label: i + 1, value: i }))
  }, [])

  function onMoveItem (oldIndex, newIndex) {
    const newItems = move(value, oldIndex, newIndex)
    onChange(newItems.map(i => getOptionValue(i)))
  }

  function onDragEnd ({ dragId, hoverIndex }) {
    const oldIndex = value.findIndex(item => stringifyValue(item) === dragId)
    const newIndex = hoverIndex < oldIndex ? hoverIndex : hoverIndex - 1
    onMoveItem(oldIndex, newIndex)
  }

  function renderDragItem (item, index) {
    const dragId = stringifyValue(item)

    // HACK: Draggable component has some visual bugs if styles are not passed
    // through style object
    const extraStyle = disabled ? { backgroundColor: getColor('bg-main-subtle') } : STYLES.cursor
    const style = [
      { ...STYLES.draggable, backgroundColor: getColor('bg-main-strong'), borderColor: getColor('border-main') },
      { width },
      extraStyle
    ]

    const Container = disabled
      ? Div
      : Draggable

    return pug`
      Container(
        style=StyleSheet.flatten(style)
        key=dragId
        dragId=dragId
        onDragEnd=onDragEnd
      )
        Div(row)
          Input(
            size='s'
            disabled=disabled
            showEmptyValue=false
            type='select'
            options=selectOptions
            value=index
            onChange=newIndex => onMoveItem(index, newIndex)
          )
          Div.span
            Span= getOptionLabel(item)
          Div.right
            Icon.icon(icon=faGripVertical styleName={ disabled })
    `
  }

  return pug`
    Div(
      style=style
      onLayout=({ nativeEvent }) => $width.set(nativeEvent.layout.width)
    )
      Span.hint(italic) To rank the listed items drag and drop each item
      DragDropProvider
        Droppable.droppable(dropId=dropId)
          each option, index in value
            = renderDragItem(option, index)
  `
})

const RankReadonly = observer(function ({ value, style }) {
  return pug`
    Div(style=style)
      each option, index in value
        Div.readonly(key=index row)
          Div.readonly-index
            Span #{index + 1}.&nbsp;
          Div.readonly-text
            Span= getOptionLabel(option)
  `
})

Rank.defaultProps = {
  options: [],
  value: []
}

Rank.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        value: PropTypes.any,
        label: PropTypes.oneOfType([PropTypes.string])
      })
    ])
  ),
  value: PropTypes.arrayOf(PropTypes.any),
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  onChange: PropTypes.func
}

export default observer(Rank)
