import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useImperativeHandle
} from 'react'
import { observer, useValue } from 'startupjs'
import { useMedia } from '@startupjs/ui'
import PropTypes from 'prop-types'
import moment from 'moment-timezone'
import 'moment/min/locales'
import Div from '../../Div'
import Divider from '../../Divider'
import TextInput from '../TextInput'
import AbstractPopover from '../../AbstractPopover'
import Drawer from '../../popups/Drawer'
import { getLocale } from './helpers'
import { Calendar, TimeSelect } from './components'
import themed from '../../../theming/themed'
import './index.styl'

// NOTE
// What about rename date property to value property like in other inputs?
function DateTimePicker ({
  style,
  dateFormat,
  timeInterval,
  is24Hour,
  size,
  mode,
  renderCaption, // DEPRECATED replace InputComponent
  renderContent, // DEPRECATED replace renderCaption
  renderInput, // replace renderContent
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
  onFocus,
  onBlur,
  onChangeDate,
  _hasError
}, ref) {
  if (renderCaption) {
    console.log('[@startupjs/ui] DateTimePicker: renderCaption is deprecated, use renderInput instead')
  }

  if (renderContent) {
    console.log('[@startupjs/ui] DateTimePicker: renderContent is deprecated, use renderInput instead')
  }

  renderInput = renderInput || renderContent || renderCaption

  const media = useMedia()
  const [visible, $visible] = useValue(false)
  const [textInput, setTextInput] = useState('')
  const refTimeSelect = useRef()
  const inputRef = useRef()

  useImperativeHandle(ref, () => inputRef.current, [])

  useEffect(() => {
    if (typeof date === 'undefined') {
      setTextInput('')
      return
    }

    let value = getDate(date)
    value = +moment.tz(date, timezone).seconds(0).milliseconds(0)
    setTextInput(getFormatDate(value))
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
    // check interval
    const interval = (timeInterval * 60 * 1000)

    const bottom = value - (value % interval)
    const top = bottom + interval
    value = top > bottom ? bottom : top

    // check min, max
    if (minDate != null && value < minDate) {
      value = minDate
    }

    if (maxDate != null && value > maxDate) {
      value = maxDate
    }

    return value
  }

  function _onChangeDate (value) {
    value = getDate(value)
    setTextInput(getFormatDate(value))
    onChangeDate && onChangeDate(value)
    $visible.set(false)
  }

  function onDismiss () {
    $visible.set(false)
  }

  const inputProps = {
    style,
    ref: inputRef,
    disabled,
    readonly,
    size,
    placeholder,
    _hasError,
    value: textInput
  }

  const caption = pug`
    if renderInput
      = renderInput(Object.assign({ $visible, onFocus, onBlur }, inputProps))
    else
      TextInput(
        ...inputProps
        onFocus=(...args) => {
          $visible.set(true)
          onFocus && onFocus(...args)
        }
        onBlur=(...args) => {
          onBlur && onBlur(...args)
        }
      )
  `

  const _date = date
    ? +moment.tz(date, timezone).seconds(0).milliseconds(0)
    : undefined

  function renderPopoverContent () {
    return pug`
      Div.content
        if (mode === 'date') || (mode === 'datetime')
          Calendar(
            date=_date
            exactLocale=exactLocale
            disabledDays=disabledDays
            locale=locale
            maxDate=maxDate
            minDate=minDate
            range=range
            timezone=timezone
            onChangeDate=_onChangeDate
          )

        if mode === 'datetime'
          Divider.divider

        if (mode === 'time') || (mode === 'datetime')
          TimeSelect(
            date=_date
            ref=refTimeSelect
            maxDate=maxDate
            minDate=minDate
            timezone=timezone
            exactLocale=exactLocale
            is24Hour=is24Hour
            timeInterval=timeInterval
            onChangeDate=_onChangeDate
          )
    `
  }

  function renderWrapper (children) {
    return pug`
      Div.popoverWrapper
        Div.popoverOverlay(feedback=false onPress=()=> $visible.set(false))
        = children
    `
  }

  return pug`
    if media.tablet
      = caption
      AbstractPopover.popover(
        visible=visible
        anchorRef=inputRef
        renderWrapper=renderWrapper
        onRequestClose=onDismiss
      )= renderPopoverContent()
    else
      = caption
      Drawer.drawer(
        visible=visible
        position='bottom'
        swipeStyleName='swipe'
        onDismiss=onDismiss
      )= renderPopoverContent()
  `
}

DateTimePicker.defaultProps = {
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
  readonly: PropTypes.bool,
  placeholder: PropTypes.string,
  maxDate: PropTypes.number,
  minDate: PropTypes.number,
  mode: PropTypes.oneOf(['date', 'time', 'datetime']),
  renderCaption: PropTypes.func,
  range: PropTypes.array,
  locale: PropTypes.string,
  timezone: PropTypes.string,
  disabledDays: PropTypes.array,
  dateFormat: PropTypes.string,
  size: PropTypes.oneOf(['l', 'm', 's']),
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChangeDate: PropTypes.func,
  _hasError: PropTypes.bool // @private
}

export default observer(
  themed('DateTimePicker', DateTimePicker),
  { forwardRef: true }
)
