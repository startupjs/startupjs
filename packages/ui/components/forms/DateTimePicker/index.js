import React, { useMemo, useRef, useCallback, useState, useEffect } from 'react'
import { Dimensions } from 'react-native'
import { observer, useValue } from 'startupjs'
import PropTypes from 'prop-types'
import moment from 'moment-timezone'
import Div from '../../Div'
import Divider from '../../Divider'
import TextInput from '../TextInput'
import Popover from '../../popups/Popover'
import Drawer from '../../popups/Drawer'
import 'moment/min/locales'
import getLocale from './getLocale'
import Calendar from './Calendar'
import TimeSelect from './TimeSelect'
import themed from '../../../theming/themed'
import STYLES from './index.styl'

function DateTimePicker ({
  style,
  dateFormat,
  timeInterval,
  is24Hour,
  size,
  mode,
  renderCaption, // replace InputComponent
  locale,
  range,
  timezone,
  disabledDays = [],
  date,
  disabled,
  label,
  placeholder,
  maxDate,
  minDate,
  onChangeDate
}) {
  const [visible, $visible] = useValue(false)
  const [textInput, setTextInput] = useState('')
  const refTimeSelect = useRef()
  const refInput = useRef()

  const [layoutWidth, $layoutWidth] = useValue(
    Math.min(Dimensions.get('window').width, Dimensions.get('screen').width)
  )
  const handleWidthChange = useCallback(() => {
    $visible.set(false)
    $layoutWidth.set(
      Math.min(Dimensions.get('window').width, Dimensions.get('screen').width)
    )
  }, [])
  useEffect(() => {
    Dimensions.addEventListener('change', handleWidthChange)
    return () => {
      $visible.set(false)
      Dimensions.removeEventListener('change', handleWidthChange)
    }
  }, [])

  const exactLocale = useMemo(() => locale || getLocale() || 'en-US', [locale])

  const _dateFormat = useMemo(() => {
    if (dateFormat) return dateFormat
    if (mode === 'datetime') {
      return moment().locale(exactLocale)._locale._longDateFormat.L + ' ' +
      moment().locale(exactLocale)._locale._longDateFormat.LT
    }

    if (mode === 'date') return moment().locale(exactLocale)._locale._longDateFormat.L
    if (mode === 'time') return moment().locale(exactLocale)._locale._longDateFormat.LT
  }, [dateFormat, timezone])

  function getFormatDate () {
    return moment.tz(date, timezone).format(_dateFormat)
  }

  useEffect(() => {
    setTextInput(getFormatDate())
  }, [date])

  const _onChangeDate = useCallback(value => {
    if (minDate != null && value < minDate) {
      value = minDate
    }

    if (maxDate != null && value > maxDate) {
      value = maxDate
    }

    onChangeDate && onChangeDate(value)
  }, [onChangeDate])

  function onFocus () {
    setTextInput(getFormatDate())
    $visible.set(true)
  }

  const onDismiss = useCallback(() => {
    $visible.set(false)
    setTextInput('')
    refInput.current.blur()
  }, [textInput])

  function onChangeText (text) {
    const momentInstance = moment.tz(text, _dateFormat, true, timezone)
    if (momentInstance.isValid()) {
      refTimeSelect.current.scrollToIndex(+momentInstance)
      onChangeDate(+momentInstance)
    }
    setTextInput(text)
  }

  const caption = pug`
    if renderCaption
      = renderCaption()
    else
      TextInput(
        ref=refInput
        style=style
        disabled=disabled
        label=label
        size=size
        placeholder=placeholder
        value=visible ? textInput : getFormatDate()
        onFocus=onFocus
        onChangeText=onChangeText
      )
  `

  const content = pug`
    Div.content
      if (mode === 'date') || (mode === 'datetime')
        Calendar(
          date=date
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
          date=date
          ref=refTimeSelect
          maxDate=maxDate
          minDate=minDate
          layoutWidth=layoutWidth
          timezone=timezone
          exactLocale=exactLocale
          is24Hour=is24Hour
          timeInterval=timeInterval
          onChangeDate=_onChangeDate
        )
  `

  // TODO: New API Popover
  return pug`
    if layoutWidth > STYLES.media.mobile
      Popover(
        visible=visible
        onDismiss=onDismiss
      )
        Popover.Caption= caption
        = content
    else
      = caption
      Drawer.drawer(
        visible=visible
        position='bottom'
        swipeStyleName='swipe'
        onDismiss=onDismiss
      )= content
  `
}

DateTimePicker.defaultProps = {
  mode: 'datetime',
  size: 'm',
  timeInterval: 1,
  timezone: moment.tz.guess()
}

DateTimePicker.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  timeInterval: PropTypes.number,
  is24Hour: PropTypes.bool,
  date: PropTypes.number,
  disabled: PropTypes.bool,
  label: PropTypes.string,
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
  onChangeDate: PropTypes.func
}

export default observer(themed(DateTimePicker))
