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
import { getOptionValue, getOptionLabel, stringifyValue, move } from './helpers'
import { faGripVertical } from '@fortawesome/free-solid-svg-icons'
import STYLES from './index.styl'



function Rank ({
  options,
  value,
  onChange,
  disabled,
  readonly,
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
    const newItems = move(items, oldIndex, newIndex)
    onChange(newItems.map(i => getOptionValue(i)))
  }

  function onDragEnd ({ dragId, hoverIndex }) {
    const oldIndex = items.findIndex(item => stringifyValue(item) === dragId)
    const newIndex = hoverIndex < oldIndex ? hoverIndex : hoverIndex - 1
    onMoveItem(oldIndex, newIndex)
  }

  function renderDragItem (item, index) {
    const dragId = stringifyValue(item)

    // HACK: Draggable component has some visual bugs if styles are not passed
    // through style object
    const cursorStyle = !readonly && !disabled ? STYLES.cursor : {}
    const style = index
    ? { ...STYLES.draggable, ...STYLES.margin, width, ...cursorStyle }
    : { ...STYLES.draggable, width, ...cursorStyle }

    const Container = readonly || disabled
      ? Div
      : Draggable

    return pug`
      Container(
        style=style
        key=dragId
        dragId=dragId
        onDragEnd=onDragEnd
      )
        Row
          Input(
            disabled=disabled
            readonly=readonly
            showEmptyValue=false
            type='select'
            options=selectOptions
            value=index
            onChange=newIndex => onMoveItem(index, newIndex)
          )
          Div.span
            Span= getOptionLabel(item)
          if !readonly && !disabled
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
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  onChange: PropTypes.func
}

export default observer(Rank, { forwardRef: true })
