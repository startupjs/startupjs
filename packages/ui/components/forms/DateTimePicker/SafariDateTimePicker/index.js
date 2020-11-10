/* @jsx unstable_createElement */
// eslint-disable-next-line
import { unstable_createElement } from 'react-native-web'
import React, { useState } from 'react'
import { observer } from 'startupjs'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import { Popover, Div } from '@startupjs/ui'
import DateInput from './DateInput'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'

// react-datepicker@1.8.0 uses momentjs
export default observer(function SafariDateTimePicker (props) {
  const { onChange, type, value = '', style, valueFormat, min, max } = props
  const [visible, setVisible] = useState(false)
  const pickerProps = {
    showTimeSelect: type !== 'date',
    showTimeSelectOnly: type === 'time',
    timeIntervals: 1,
    timeFormat: 'HH:mm'
  }
  if (min) pickerProps.minDate = min
  if (max) pickerProps.maxDate = max

  function getSelected () {
    if (value) return moment(value, valueFormat)
  }

  function getWidth () {
    if (type === 'datetime' || type === 'datetime-local') return 314
    if (type === 'time') return 72
    return 242
  }

  // get system format for representation
  function getDateFormat () {
    if (type === 'time') return 'HH:mm'
    const res = new Date(1970, 10, 15)
      .toLocaleDateString()
      .replace(1970, 'YYYY')
      .replace(11, 'MM')
      .replace(15, 'DD')
      .replaceAll('/', '.') + ((type === 'datetime' || type === 'datetime-local') ? ', HH:mm' : '')
    return res
  }

  function formatDate (date) {
    if (!date) return ''
    return moment(date, valueFormat).format(getDateFormat())
  }

  function handleDateChange (value) {
    let format = []
    if (type !== 'time') format.push('YYYY-MM-DD')
    if (type.includes('time')) format.push('HH:mm')
    const newValue = value.format(format.join('T'))
    onChange(newValue)
    if (type !== 'datetime' && type !== 'datetime-local') setVisible(false)
  }

  return pug`
    Popover(
      visible=visible
      onDismiss=() => setVisible(false)
      wrapperStyle={ width: getWidth(), borderRadius: 4 }
      animateType="scale"
      durationOpen=1
      durationClose=1
    )
      Popover.Caption
        DateInput(
          style=style 
          onFocus=() => setVisible(true)
          value=formatDate(value)
        )
      Div
        DatePicker(
          ...pickerProps
          onChange=handleDateChange
          selected=getSelected()
          inline
        )
  `
})
