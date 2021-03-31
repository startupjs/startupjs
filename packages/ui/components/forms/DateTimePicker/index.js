import React, { useEffect, useMemo, useState } from 'react'
import { Keyboard, Platform } from 'react-native'
import RNCDateTimePicker from '@react-native-community/datetimepicker'
import TimePickerAndroid from '@react-native-community/datetimepicker/src/timepicker.android'
import DatePickerAndroid from '@react-native-community/datetimepicker/src/datepicker.android'
import { observer } from 'startupjs'
import moment from 'moment-timezone'
import PropTypes from 'prop-types'
import Button from '../../Button'
import Drawer from '../../popups/Drawer'
import Row from '../../Row'
import Span from '../../typography/Span'
import STYLES from './index.styl'

const { colors: { mainText, secondaryText } } = STYLES

const FORMATS = {
  date: 'YYYY-MM-DD',
  datetime: 'YYYY-MM-DD HH:mm',
  time: 'HH:mm'
}

function DateTimePicker ({
  cancelButtonText,
  confirmButtonText,
  date,
  disabled,
  format,
  is24Hour,
  label,
  maxDate,
  minDate,
  minuteInterval,
  mode,
  placeholder,
  size,
  onDateChange
}) {
  const [inputDate, setInputDate] = useState()
  const [visible, setVisible] = useState(false)
  const [focused, setFocused] = useState(false)

  const _format = useMemo(() => format || FORMATS[mode], [format])
  const _is24Hour = useMemo(() => (typeof is24Hour === 'boolean' ? is24Hour : !_format.match(/h|a/g)), [
    is24Hour,
    _format
  ])

  function getDate (_date = inputDate) {
    if (!_date) {
      let now = new Date()
      if (minDate) {
        let _minDate = getDate(minDate)

        if (now < _minDate) {
          return _minDate
        }
      }

      if (maxDate) {
        let _maxDate = getDate(maxDate)

        if (now > _maxDate) {
          return _maxDate
        }
      }

      return now
    }

    if (_date instanceof Date) {
      return _date
    }

    return moment(_date).toDate()
  }

  useEffect(() => {
    if (!date) return
    moment(inputDate).valueOf() !== date && setInputDate(getDate(date))
  }, [date])

  function onPressCancel () {
    setFocused(false)
    onToggleModal(false)
  }

  function onPressConfirm () {
    datePicked()
    onToggleModal(false)
  }

  function onToggleModal (visible) {
    setVisible(visible)
  }

  function getDateStr () {
    return moment(date).format(_format)
  }

  function datePicked (_date) {
    setFocused(false)
    onDateChange && onDateChange(moment(_date || inputDate).valueOf())
  }

  function onDatePicked ({ action, year, month, day }) {
    if (action !== DatePickerAndroid.dismissedAction) {
      const newDate = new Date(year, month, day)
      setInputDate(newDate)
      datePicked(newDate)
    } else {
      onPressCancel()
    }
  }

  function onTimePicked ({ action, hour, minute }) {
    if (action !== DatePickerAndroid.dismissedAction) {
      const newDate = moment().hour(hour).minute(minute).toDate()
      setInputDate(newDate)
      datePicked(newDate)
    } else {
      onPressCancel()
    }
  }

  function onDatetimeTimePicked ({ action, hour, minute }, year, month, day) {
    if (action !== DatePickerAndroid.dismissedAction) {
      const newDate = new Date(year, month, day, hour, minute)
      setInputDate(newDate)
      datePicked(newDate)
    } else {
      onPressCancel()
    }
  }

  function onDatetimePicked ({ action, year, month, day }) {
    if (action !== DatePickerAndroid.dismissedAction) {
      let timeMoment = moment(inputDate)
      const newDate = new Date(year, month, day, timeMoment.hour(), timeMoment.minutes())
      TimePickerAndroid.open({
        value: newDate,
        is24Hour: _is24Hour
      }).then(e => onDatetimeTimePicked(e, year, month, day))
    } else {
      onPressCancel()
    }
  }

  function onPressDate () {
    setFocused(true)
    Keyboard.dismiss()

    setInputDate(getDate())

    if (Platform.OS === 'ios') {
      onToggleModal(true)
    } else {
      if (mode === 'date') {
        DatePickerAndroid.open({
          value: inputDate,
          minimumDate: minDate && getDate(minDate),
          maximumDate: maxDate && getDate(maxDate)
        }).then(onDatePicked)
      } else if (mode === 'time') {
        TimePickerAndroid.open({
          value: inputDate,
          is24Hour: _is24Hour,
          minuteInterval: minuteInterval
        }).then(onTimePicked)
      } else {
        DatePickerAndroid.open({
          value: inputDate,
          minimumDate: minDate && getDate(minDate),
          maximumDate: maxDate && getDate(maxDate),
          is24Hour: _is24Hour,
          minuteInterval: minuteInterval
        }).then(onDatetimePicked)
      }
    }
  }

  return pug`
    if label
      Span(
        styleName={focused}
        size='s'
        variant='description'
      )= label

    Button(
      textStyle={ color: date ? mainText : secondaryText }
      color= focused ? 'primary' : 'dark'
      size=size
      disabled=disabled
      onPress=onPressDate
    )= placeholder && !date ? placeholder : getDateStr()

    if Platform.OS === 'ios'
      Drawer.drawer(
        swipeStyleName='swipe'
        visible=visible
        position='bottom'
        onDismiss=onPressCancel
      )
        Row.buttons(
          align='between'
          vAlign='center'
        )
          Button.button.cancelButton(
            textStyleName='cancelButtonText'
            variant='text'
            onPress=onPressCancel
          )= cancelButtonText
          Button.button.confirmButton(
            textStyleName='confirmButtonText'
            variant='text'
            onPress=onPressConfirm
          )= confirmButtonText
        // DateTimePicker cannot get its dimensions when rendering starts
        if visible
          RNCDateTimePicker.picker(
            value=getDate()
            mode=mode
            minimumDate=minDate && getDate(minDate)
            maximumDate=maxDate && getDate(maxDate)
            onChange= (event, date) => setInputDate(date)
            minuteInterval=minuteInterval
          )
  `
}

DateTimePicker.defaultProps = {
  cancelButtonText: 'Cancel',
  confirmButtonText: 'Ok',
  mode: 'datetime',
  size: 'm'
}

DateTimePicker.propTypes = {
  cancelButtonText: PropTypes.string,
  confirmButtonText: PropTypes.string,
  date: PropTypes.number,
  disabled: PropTypes.bool,
  format: PropTypes.string,
  is24Hour: PropTypes.bool,
  label: PropTypes.string,
  maxDate: PropTypes.number,
  minDate: PropTypes.number,
  minuteInterval: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30]),
  mode: PropTypes.oneOf(['date', 'time', 'datetime']),
  placeholder: PropTypes.string,
  size: PropTypes.oneOf(['l', 'm', 's']),
  onDateChange: PropTypes.func
}

export default observer(DateTimePicker)
