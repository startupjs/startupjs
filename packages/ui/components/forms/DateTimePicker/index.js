import React, { useEffect, useMemo, useState } from 'react'
import { Keyboard, Platform } from 'react-native'
import RNCDateTimePicker from '@react-native-community/datetimepicker'
import TimePickerAndroid from '@react-native-community/datetimepicker/src/timepicker.android'
import DatePickerAndroid from '@react-native-community/datetimepicker/src/datepicker.android'
import { observer, useValue } from 'startupjs'
import moment from 'moment-timezone'
import PropTypes from 'prop-types'
import Button from '../../Button'
import Drawer from '../../popups/Drawer'
import Row from '../../Row'
import themed from '../../../theming/themed'
import wrapInput from './../wrapInput'
import STYLES from './index.styl'

const { colors: { mainText, secondaryText } } = STYLES

const FORMATS = {
  date: 'YYYY-MM-DD',
  datetime: 'YYYY-MM-DD HH:mm',
  time: 'HH:mm'
}

function DateTimePicker ({
  inputStyle,
  cancelButtonText,
  confirmButtonText,
  date,
  disabled,
  format,
  is24Hour,
  label,
  description,
  layout,
  maxDate,
  minDate,
  minuteInterval,
  mode,
  placeholder,
  size,
  onFocus,
  onBlur,
  onDateChange
}) {
  const [inputDate, setInputDate] = useState()
  const [visible, setVisible] = useState(false)
  const [inputState, $inputState] = useValue({ focused: false })
  const _format = useMemo(() => format || FORMATS[mode], [format])
  const _is24Hour = useMemo(() => (typeof is24Hour === 'boolean' ? is24Hour : !_format.match(/h|a/g)), [
    is24Hour,
    _format
  ])

  function focusHandler (...args) {
    if (inputState.focused || disabled) return
    onFocus && onFocus(...args)
    $inputState.set('focused', true)
  }

  function blurHandler (...args) {
    if (!inputState.focused || disabled) return
    onBlur && onBlur(...args)
    $inputState.set('focused', false)
  }

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
    blurHandler()
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
    blurHandler()
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
    focusHandler()
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
    Button(
      style=inputStyle
      textStyle={ color: date ? mainText : secondaryText }
      color=inputState.focused ? 'primary' : 'dark'
      size=size
      disabled=disabled
      onPress=onPressDate
    )= placeholder && !date ? placeholder : getDateStr()
  `
}

DateTimePicker.defaultProps = {
  cancelButtonText: 'Cancel',
  confirmButtonText: 'Ok',
  mode: 'datetime',
  size: 'm'
}

DateTimePicker.propTypes = {
  inputStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  cancelButtonText: PropTypes.string,
  confirmButtonText: PropTypes.string,
  date: PropTypes.number,
  disabled: PropTypes.bool,
  format: PropTypes.string,
  is24Hour: PropTypes.bool,
  maxDate: PropTypes.number,
  minDate: PropTypes.number,
  minuteInterval: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30]),
  mode: PropTypes.oneOf(['date', 'time', 'datetime']),
  placeholder: PropTypes.string,
  size: PropTypes.oneOf(['l', 'm', 's']),
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onDateChange: PropTypes.func,
  _hasError: PropTypes.bool // @private TODO: realize error view in new datetimepicker
}

const ObservedDateTimePicker = observer(
  themed('DateTimePicker', DateTimePicker)
)
const WrappedObservedDateTimePicker = wrapInput(
  ObservedDateTimePicker,
  { rows: { descriptionPosition: 'bottom' } }
)

export default WrappedObservedDateTimePicker
