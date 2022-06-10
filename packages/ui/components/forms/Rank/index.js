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

function Rank (props) {
  const { options, readonly, value } = props

  const sortedOptions = useMemo(() => {
    return options.slice().sort((a, b) => {
      return value.findIndex(i => stringifyValue(i) === stringifyValue(a)) -
        value.findIndex(i => stringifyValue(i) === stringifyValue(b))
    })
  }, [value.toString()])

  return pug`
    if readonly
      RankReadonly(ortedOptions=sortedOptions)
    else
      RankInput(...props sortedOptions=sortedOptions)
  `
}

const RankInput = observer(function ({
  sortedOptions,
  onChange,
  disabled,
  style
}) {
  const [width, $width] = useValue()
  const dropId = useMemo(() => $root.id(), [])

  const selectOptions = useMemo(() => {
    return sortedOptions.map((o, i) => ({ label: i + 1, value: i }))
  }, [])

  function onMoveItem (oldIndex, newIndex) {
    const newItems = move(sortedOptions, oldIndex, newIndex)
    onChange(newItems.map(i => getOptionValue(i)))
  }

  function onDragEnd ({ dragId, hoverIndex }) {
    const oldIndex = sortedOptions.findIndex(item => stringifyValue(item) === dragId)
    const newIndex = hoverIndex < oldIndex ? hoverIndex : hoverIndex - 1
    onMoveItem(oldIndex, newIndex)
  }

  function renderDragItem (item, index) {
    const dragId = stringifyValue(item)

    // HACK: Draggable component has some visual bugs if styles are not passed
    // through style object
    const cursorStyle = disabled ? {} : STYLES.cursor
    const style = { ...STYLES.draggable, width, ...cursorStyle }

    const Container = disabled
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
            showEmptyValue=false
            type='select'
            options=selectOptions
            value=index
            onChange=newIndex => onMoveItem(index, newIndex)
          )
          Div.span
            Span= getOptionLabel(item)
          unless disabled
            Div.icon
              Icon(icon=faGripVertical)
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
          each option, index in sortedOptions
            = renderDragItem(option, index)
  `
})

const RankReadonly = observer(function ({ sortedOptions }) {
  return pug`
    each option, index in sortedOptions
      Span.readonly
        | #{index + 1}.&nbsp;
        = getOptionLabel(option)
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

export default observer(Rank, { forwardRef: true })
