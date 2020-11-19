import React, { useEffect, useMemo, useState } from 'react'
import DatePicker from 'react-native-datepicker'
import { observer } from 'startupjs'
import moment from 'moment-timezone'
import PropTypes from 'prop-types'
import Span from './../../typography/Span'
import './index.styl'

function DateTimePicker ({
  mode = 'datetime',
  onDateChange,
  date,
  minDate,
  maxDate,
  label,
  style,
  ...props
}) {
  const [inputDate, setInputDate] = useState()

  const formatDate = useMemo(() => {
    let _formatDate = 'YYYY-MM-DD HH:mm'
    switch (mode) {
      case 'date':
        _formatDate = 'YYYY-MM-DD'
        break
      case 'time':
        _formatDate = 'HH:mm'
        break
      default:
        break
    }
    return _formatDate
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

  function onChangeDate (date) {
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

  return pug`
    if label
      Span.label(
        size='s'
        variant='description'
      )= label
    DatePicker.root(
      ...props
      style=style
      date=inputDate
      min=minDate && moment(minDate).format(formatDate)
      max=maxDateDefault.format(formatDate)
      iconComponent=() => {}
      mode=mode
      onDateChange=onChangeDate
      confirmBtnText='OK'
      cancelBtnText='Cancel'
    )
  `
}

DateTimePicker.defaultProps = {
  mode: 'datetime'
}

DateTimePicker.propTypes = {
  mode: PropTypes.oneOf(['date', 'time', 'datetime']),
  onDateChange: PropTypes.func,
  date: PropTypes.any,
  minDate: PropTypes.number,
  maxDate: PropTypes.number,
  label: PropTypes.string,
  style: PropTypes.object
}

export default observer(DateTimePicker)
