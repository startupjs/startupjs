import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useImperativeHandle
} from 'react'
import { Platform } from 'react-native'
import RNDateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { pug, observer, useBind, $ } from 'startupjs'
import { useMedia, Button } from '@startupjs/ui'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle'
import PropTypes from 'prop-types'
import moment from 'moment-timezone'
import Div from '../../Div'
import Divider from '../../Divider'
import TextInput from '../TextInput'
import AbstractPopover from '../../AbstractPopover'
import Drawer from '../../popups/Drawer'
import { getLocale } from './helpers'
import { Calendar, TimeSelect } from './components'
import themed from '../../../theming/themed'
import 'moment/min/locales'
import './index.styl'

function DateTimePicker ({
  style,
  contentStyle = {},
  dateFormat,
  display,
  timeInterval,
  is24Hour,
  size,
  mode,
  renderInput,
  locale,
  range,
  timezone,
  disabledDays = [],
  date,
  disabled,
  readonly,
  placeholder,
  maxDate,
  minDate,
  visible,
  $visible,
  testID,
  calendarTestID,
  onPressIn,
  onChangeDate,
  onRequestOpen,
  onRequestClose,
  _hasError,
  ...props
}, ref) {
  const media = useMedia()
  const [textInput, setTextInput] = useState('')
  const refTimeSelect = useRef()
  const inputRef = useRef()
  const insets = useSafeAreaInsets()

  useImperativeHandle(ref, () => inputRef.current, [])

  let bindProps = useMemo(() => {
    if (typeof $visible !== 'undefined') return { $visible }
    if (typeof onRequestOpen === 'function' && typeof onRequestClose === 'function') {
      return {
        visible,
        onChangeVisible: (value) => {
          if (value) {
            onRequestOpen()
          } else {
            onRequestClose()
          }

          if (Platform.OS === 'android' && value) {
            showAndroidPicker()
          }
        }
      }
    }
  }, [])

  if (!bindProps) {
    $visible = $(false)
    bindProps = { $visible }
  }

  let { onChangeVisible } = bindProps
  ;({ visible, onChangeVisible } = useBind({ $visible, visible, onChangeVisible }))

  const [tempDate, setTempDate] = useTempDate({ visible, date, timezone })

  useEffect(() => {
    // Prevent crashes when custom renderer passed via props
    if (renderInput) return
    if (visible) {
      inputRef?.current?.focus()
    } else {
      inputRef?.current?.blur()
    }
  }, [visible])

  useEffect(() => {
    if (typeof date === 'undefined') {
      setTextInput('')
      return
    }

    let value = getDate(date)
    value = +moment.tz(date, timezone).seconds(0).milliseconds(0)
    setTextInput(getFormatDate(value))
    setTempDate(new Date(value))
  }, [date])

  const exactLocale = useMemo(() => {
    const locales = moment.locales()
    const _locale = locale || getLocale()
    return locales.includes(_locale) ? _locale : 'en'
  }, [locale])

  const _dateFormat = useMemo(() => {
    if (dateFormat) return dateFormat
    if (mode === 'datetime') {
      return moment().locale(exactLocale)._locale._longDateFormat.L + ' ' +
      moment().locale(exactLocale)._locale._longDateFormat.LT
    }

    if (mode === 'date') return moment().locale(exactLocale)._locale._longDateFormat.L
    if (mode === 'time') return moment().locale(exactLocale)._locale._longDateFormat.LT
  }, [mode, dateFormat, timezone])

  function getFormatDate (value) {
    return moment.tz(value, timezone).format(_dateFormat)
  }

  function getDate (value) {
    const interval = (timeInterval * 60 * 1000)

    const bottom = value - (value % interval)
    const top = bottom + interval
    value = top > bottom ? bottom : top

    if (minDate != null && value < minDate) {
      value = minDate
    }

    if (maxDate != null && value > maxDate) {
      value = maxDate
    }

    return value
  }

  function _onChangeDate (value) {
    const timestamp = getTimestampFromValue(value)
    onChangeDate && onChangeDate(timestamp)
    onChangeVisible(false)
  }

  function _onPressIn (...args) {
    if (Platform.OS === 'android') {
      showAndroidPicker()
    }

    onChangeVisible(true)

    onPressIn && onPressIn(...args)
  }

  function onDismiss () {
    onChangeVisible(false)
  }

  function showAndroidPicker () {
    const showTimepicker = (selectedDate) => {
      DateTimePickerAndroid.open({
        value: selectedDate,
        mode: 'time',
        display: 'time',
        is24Hour,
        onChange: (event, selectedTime) => {
          if (event.type === 'set') {
            const finalDate = new Date(selectedDate)
            finalDate.setHours(selectedTime.getHours())
            finalDate.setMinutes(selectedTime.getMinutes())
            _onChangeDate(finalDate)
          } else {
            onDismiss()
          }
        }
      })
    }

    const showDatepicker = () => {
      DateTimePickerAndroid.open({
        value: tempDate,
        mode: 'date',
        display: 'calendar',
        maximumDate: maxDate ? new Date(maxDate) : undefined,
        minimumDate: minDate ? new Date(minDate) : undefined,
        onChange: (event, selectedDate) => {
          if (event.type === 'set') {
            if (mode === 'datetime') {
              showTimepicker(selectedDate)
            } else {
              _onChangeDate(selectedDate)
            }
          } else {
            onDismiss()
          }
        }
      })
    }

    switch (mode) {
      case 'date':
        showDatepicker()
        break
      case 'time':
        DateTimePickerAndroid.open({
          value: tempDate,
          mode: 'time',
          display: 'clock',
          is24Hour,
          onChange: (event, selectedTime) => {
            if (event.type === 'set') {
              _onChangeDate(selectedTime)
            } else {
              onDismiss()
            }
          }
        })
        break
      case 'datetime':
        showDatepicker()
        break
    }
  }

  const inputProps = {
    style,
    ref: inputRef,
    disabled,
    readonly,
    size,
    placeholder,
    _hasError,
    value: textInput,
    testID,
    ...props
  }

  if (Platform.OS === 'web') {
    inputProps.editable = false
    inputProps.onFocus = _onPressIn
  }

  if (Platform.OS === 'android') {
    inputProps.onFocus = _onPressIn
    // Hide cursor for android
    inputProps.cursorColor = 'transparent'
  }

  if (Platform.OS === 'ios') {
    inputProps.onPressIn = _onPressIn
  }

  function handleRenderedInputPress (value) {
    if (Platform.OS === 'android' && value) {
      showAndroidPicker()
    }

    onChangeVisible(value)
  }

  const caption = pug`
    if renderInput
      = renderInput(Object.assign({ onChangeVisible: handleRenderedInputPress }, inputProps))
    else
      TextInput(
        showSoftInputOnFocus=false
        secondaryIcon=textInput && !renderInput ? faTimesCircle : undefined,
        onSecondaryIconPress=() => onChangeDate && onChangeDate()
        ...inputProps
      )
  `

  function renderPopoverContent () {
    return pug`
      Div.content(
        style={
          paddingBottom: (media.tablet && Platform.OS === 'ios') ? 0 : insets.bottom,
          ...contentStyle
        }
      )
        if Platform.OS === 'web'
          if (mode === 'date') || (mode === 'datetime')
            Calendar(
              date=tempDate
              exactLocale=exactLocale
              disabledDays=disabledDays
              locale=locale
              maxDate=maxDate
              minDate=minDate
              range=range
              timezone=timezone
              testID=calendarTestID
              onChangeDate=(newDate) => {
                setTempDate(newDate)
                if (mode === 'date') _onChangeDate(newDate)
              }
            )

          if mode === 'datetime'
            Divider.divider

          if (mode === 'time') || (mode === 'datetime')
            TimeSelect(
              date=tempDate
              ref=refTimeSelect
              maxDate=maxDate
              minDate=minDate
              timezone=timezone
              exactLocale=exactLocale
              is24Hour=is24Hour
              timeInterval=timeInterval
              onChangeDate=(newTime) => {
                const finalDate = new Date(tempDate)
                finalDate.setHours(new Date(newTime).getHours())
                finalDate.setMinutes(new Date(newTime).getMinutes())
                _onChangeDate(finalDate)
              }
            )
        else if Platform.OS === 'ios'
          Div.actions(row)
            Button(
              size='s'
              color='secondary'
              variant='text'
              onPress=() => {
                onDismiss()
              }
            ) Cancel
            Button(
              size='s'
              color='primary'
              variant='text'
              onPress=() => {
                _onChangeDate(tempDate)
              }
            ) Done
          RNDateTimePicker.rnPicker(
            value=tempDate
            display=display
            is24Hour=is24Hour
            disabled=disabled
            mode=mode
            themeVariant='light'
            textColor='#000000cc'
            maximumDate=maxDate ? new Date(maxDate) : undefined
            minimumDate=minDate ? new Date(minDate) : undefined
            timeZoneName=timezone
            onChange=(event, selectedDate) => {
              if (event.type !== 'dismissed') {
                setTempDate(selectedDate)
              }
            }
          )
    `
  }

  function renderWrapper (children) {
    return pug`
      Div.popoverWrapper
        Div.popoverOverlay(feedback=false onPress=()=> onChangeVisible(false))
        = children
    `
  }

  return pug`
    // Android datetimepicker rendered inside its own modal
    if Platform.OS === 'android'
      = caption
    else
      if media.tablet
        = caption
        AbstractPopover.popover(
          visible=visible
          anchorRef=inputRef
          renderWrapper=renderWrapper
        )= renderPopoverContent()
      else
        = caption
        Drawer.drawer(
          visible=visible
          position='bottom'
          swipeStyleName='swipe'
          AreaComponent=Div
          onDismiss=onDismiss
        )= renderPopoverContent()
  `
}

DateTimePicker.defaultProps = {
  display: 'spinner',
  mode: 'datetime',
  size: 'm',
  timeInterval: 5,
  timezone: moment.tz.guess()
}

DateTimePicker.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  timeInterval: PropTypes.number,
  is24Hour: PropTypes.bool,
  date: PropTypes.number,
  disabled: PropTypes.bool,
  display: PropTypes.oneOf(['default', 'spinner', 'calendar', 'clock']),
  readonly: PropTypes.bool,
  placeholder: PropTypes.string,
  maxDate: PropTypes.number,
  minDate: PropTypes.number,
  mode: PropTypes.oneOf(['date', 'time', 'datetime', 'countdown']),
  renderInput: PropTypes.func,
  range: PropTypes.array,
  locale: PropTypes.string,
  timezone: PropTypes.string,
  disabledDays: PropTypes.array,
  dateFormat: PropTypes.string,
  size: PropTypes.oneOf(['l', 'm', 's']),
  onBlur: PropTypes.func,
  onChangeDate: PropTypes.func,
  _hasError: PropTypes.bool // @private
}

export default observer(
  themed('DateTimePicker', DateTimePicker),
  { forwardRef: true }
)

function getTimestampFromValue (value) {
  if (value?.nativeEvent?.timestamp) {
    return value.nativeEvent.timestamp
  }

  if (value instanceof Date) {
    return value.getTime()
  }

  return value
}

function useTempDate ({ visible, date, timezone }) {
  const [tempDate, setTempDate] = useState(getTempDate(date, timezone))

  useEffect(() => {
    const tempDate = getTempDate(date, timezone)
    setTempDate(tempDate)
  }, [visible, date, timezone])

  return [tempDate, setTempDate]
}

function getTempDate (date, timezone) {
  return date
    ? new Date(+moment.tz(date, timezone).seconds(0).milliseconds(0))
    : new Date()
}
