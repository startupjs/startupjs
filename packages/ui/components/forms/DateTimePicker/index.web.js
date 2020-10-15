/* @jsx unstable_createElement */
// eslint-disable-next-line
import { unstable_createElement } from 'react-native-web'
import React, { useMemo, useState, useEffect } from 'react'
import { observer } from 'startupjs'
import Span from './../../typography/Span'
import moment from 'moment-timezone'
import './index.styl'

export default observer(function DateTimePicker ({
  date,
  mode = 'datetime',
  placeholder,
  label,
  onDateChange,
  minDate,
  maxDate,
  style,
  ...props
}) {
  const [inputDate, setInputDate] = useState()
  const [focused, setFocused] = useState()
  const formatDate = useMemo(() => {
    let format
    switch (mode) {
      case 'date':
        format = 'YYYY-MM-DD'
        break
      case 'time':
        format = 'HH:mm'
        break
      default:
        format = 'YYYY-MM-DDTHH:mm'
        break
    }
    return format
  }, [mode])

  const maxDateDefault = useMemo(() => {
    return maxDate ? moment(maxDate) : moment().add(100, 'year')
  }, [maxDate])

  useEffect(() => {
    if (!date) return
    if (mode === 'time') return setInputDate(date)
    const dateValue = moment(date).format(formatDate)
    setInputDate(dateValue)
  }, [date])

  function changeDate (date) {
    if (!date) return onDateChange && onDateChange()
    if (mode === 'time') return onDateChange && onDateChange(date)

    const timestamp = moment(date).valueOf()
    timestamp && onDateChange && onDateChange(timestamp)

    if (timestamp > maxDateDefault) {
      const maxDateFormat = moment(maxDateDefault).format(formatDate)
      setInputDate(maxDateFormat)
      onDateChange && onDateChange(maxDate)
    }

    if (minDate && timestamp < minDate) {
      const minDateFormat = moment(minDate).format(formatDate)
      setInputDate(minDateFormat)
      onDateChange && onDateChange(minDate)
    }
  }

  const onFocus = () => setFocused(true)
  const onBlur = () => setFocused()

  return pug`
    if label
    Span.label(
      styleName={focused}
      size='s'
      variant='description'
    )= label
    input.root(
      ...props
      style=style
      min=minDate && moment(minDate).format(formatDate)
      max=maxDateDefault.format(formatDate)
      type=mode === 'datetime' ? 'datetime-local' : mode
      onFocus=onFocus
      onChange=e => setInputDate(e.target.value)
      onBlur=e => {
        changeDate(e.target.value)
        onBlur()
      }
      value=inputDate
      placeholder=placeholder
    )
  `
})
