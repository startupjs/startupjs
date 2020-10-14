import React, { useState, useMemo } from 'react'
import { observer } from 'startupjs'
import moment from 'moment-timezone'
import { Keyboard, View } from 'react-native'
import { Calendar } from 'react-native-calendars'
import Icon from './../../Icon'
import TextInput from './../../TextInput'
import Button from './../../Button'
import Row from './../../Row'
import { faCaretLeft, faTimes } from '@fortawesome/free-solid-svg-icons'
import './index.styl'

export default observer(function DatePicker ({
  date = null,
  onChange,
  onRemove,
  placeholder = 'Due Date',
  color = 'primary',
  dateFormat = 'YYYY-MM-DD'
}) {
  const dateLabel = date ? moment(date).format(dateFormat) : ''
  const [showCalendarModal, setShowCalendarModal] = useState()

  const onDayPress = (day) => {
    onChange(new Date(day.timestamp))
    closeCalendarModal()
  }

  const closeCalendarModal = () => {
    setShowCalendarModal()
  }

  const renderArrow = (direction) => {
    return pug`
      View.calendarArrow(styleName=[direction])
        Icon(icon=faCaretLeft color=color)
    `
  }

  const selectedDate = useMemo(() => {
    const dates = {}
    const convertedDate = moment(date).format('YYYY-MM-DD')
    dates[convertedDate] = { selected: true, selectedColor: color }
    return dates
  }, [date])

  return pug`
    Row(vAlign='center')
      TextInput.input(
        placeholder=placeholder
        selectionColor='transparent'
        value=dateLabel
        onFocus=() => {
          Keyboard.dismiss()
          setShowCalendarModal(true)
        }
      )
      if onRemove
        Button.remove(
          icon=faTimes
          variant='text'
          color='primary'
          onPress=() => {
            onRemove()
            closeCalendarModal()
          }
        )
    if showCalendarModal
      Calendar(
        minDate=new Date()
        renderArrow=renderArrow
        onDayPress=onDayPress
        markedDates=selectedDate
      )
  `
})
