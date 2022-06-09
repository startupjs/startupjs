import React, { useMemo } from 'react'
import { observer, $root, useValue } from 'startupjs'
import {
  DragDropProvider,
  Draggable,
  Droppable,
  Span,
  Row,
  Icon,
  Input,
  Div
} from '../../..'
import PropTypes from 'prop-types'
import { faGripVertical } from '@fortawesome/free-solid-svg-icons'
import STYLES from './index.styl'

function stringifyValue (option) {
  try {
    const v = getOptionValue(option)
    return JSON.stringify(v)
  } catch (err) {
    console.error(err)
  }
}

function getOptionValue (option) {
  return option?.value || option
}

function getOptionLabel (option) {
  return option?.label || option
}

function _move (arr, oldIndex, newIndex) {
  const arrCopy = arr.slice()
  const element = arrCopy[oldIndex]
  arrCopy.splice(oldIndex, 1)
  arrCopy.splice(newIndex, 0, element)
  return arrCopy
}

function Rank ({
  options,
  value,
  onChange,
  style
}) {
  const [width, $width] = useValue()
  const dropId = useMemo(() => $root.id(), [])
  const items = useMemo(() => {
    return options.slice().sort((a, b) => {
      return value.findIndex(i => stringifyValue(i) === stringifyValue(a)) -
        value.findIndex(i => stringifyValue(i) === stringifyValue(b))
    })
  }, [value.toString()])

  const selectOptions = useMemo(() => {
    return options.map((o, i) => ({ label: i + 1, value: i }))
  }, [])

  function onMoveItem (oldIndex, newIndex) {
    const newItems = _move(items, oldIndex, newIndex)
    onChange(newItems.map(i => getOptionValue(i)))
  }

  function onDragEnd ({ dragId, hoverIndex }) {
    const oldIndex = items.findIndex(item => stringifyValue(item) === dragId)
    const newIndex = hoverIndex < oldIndex ? hoverIndex : hoverIndex - 1
    onMoveItem(oldIndex, newIndex)
  }

  function renderDragItem (item, index) {
    const dragId = stringifyValue(item)
    const style = index
      ? { ...STYLES.draggable, ...STYLES.margin, width }
      : { ...STYLES.draggable, width }

    // HACK: Draggable component has some visual bugs if styles are not passed
    // through style object
    return pug`
      Draggable(
        style=style
        key=dragId
        dragId=dragId
        onDragEnd=onDragEnd
      )
        Row
          Input(
            showEmptyValue=false
            type='select'
            options=selectOptions
            value=index
            onChange=newIndex => onMoveItem(index, newIndex)
          )
          Div.span
            Span= getOptionLabel(item)
          Div.icon
            Icon(icon=faGripVertical)
    `
  }

  return pug`
    Div(
      style=style
      onLayout=({ nativeEvent }) => $width.set(nativeEvent.layout.width)
    )
      DragDropProvider
        Droppable.droppable(dropId=dropId)
          each item, index in items
            = renderDragItem(item, index)

  `
}

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
  onChange: PropTypes.func
}

export default observer(Rank, { forwardRef: true })
