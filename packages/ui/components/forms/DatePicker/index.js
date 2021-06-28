import React, { useMemo, useRef, useCallback, useState, useEffect } from 'react'
import { Dimensions } from 'react-native'
import { observer, useValue } from 'startupjs'
import PropTypes from 'prop-types'
import moment from 'moment'
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

function DatePicker ({
  style,
  formatInput,
  hourInterval,
  minuteInterval,
  is24Hour,
  size,
  mode,
  renderCaption, // replace InputComponent
  locale,
  range,
  timezone = moment.tz.guess(),
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
  const refInput = useRef()

  const [layoutWidth, $layoutWidth] = useValue(
    Math.min(Dimensions.get('window').width, Dimensions.get('screen').width)
  )
  function handleWidthChange () {
    $visible.set(false)
    $layoutWidth.set(
      Math.min(Dimensions.get('window').width, Dimensions.get('screen').width)
    )
  }
  useEffect(() => {
    Dimensions.addEventListener('change', handleWidthChange)
    return () => {
      $visible.set(false)
      Dimensions.removeEventListener('change', handleWidthChange)
    }
  }, [])

  const exactLocale = useMemo(() => locale || getLocale() || 'en-US', [locale])
  const _is24Hour = useMemo(() => {
    return (is24Hour !== undefined)
      ? new RegExp(/a/i).test(moment().locale(exactLocale)._locale._longDateFormat.LT)
      : is24Hour
  }, [exactLocale, is24Hour])

  const _formatInput = useMemo(() => {
    if (formatInput) return formatInput
    if (mode === 'datetime') {
      return moment().locale(exactLocale)._locale._longDateFormat.L + ' ' +
      moment().locale(exactLocale)._locale._longDateFormat.LT
    }

    if (mode === 'date') return moment().locale(exactLocale)._locale._longDateFormat.L
    if (mode === 'time') return moment().locale(exactLocale)._locale._longDateFormat.LT
  }, [formatInput])

  function getFormatDate () {
    return moment
      .tz(date, timezone)
      .locale(exactLocale)
      .format(_formatInput)
  }

  useEffect(() => {
    setTextInput(getFormatDate())
  }, [date])

  const _onChangeDate = useCallback(value => {
    onChangeDate && onChangeDate(value)
  }, [onChangeDate])

  function onFocus () {
    setTextInput(getFormatDate())
    $visible.set(true)
  }

  function onDismiss () {
    if (!visible) return

    const momentInstance = moment(textInput, _formatInput)

    if (momentInstance.isValid()) {
      onChangeDate(+momentInstance)
    }

    $visible.set(false)
    setTextInput('')
    refInput.current.blur()
  }

  function onChangeText (text) {
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
          maxDate=maxDate
          minDate=minDate
          layoutWidth=layoutWidth
          timezone=timezone
          exactLocale=exactLocale
          is24Hour=_is24Hour
          hourInterval=hourInterval
          minuteInterval=minuteInterval
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

DatePicker.defaultProps = {
  mode: 'datetime',
  size: 'm',
  maxDate: moment().add(100, 'year').valueOf(),
  hourInterval: 1,
  minuteInterval: 1
}

DatePicker.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  hourInterval: PropTypes.number,
  minuteInterval: PropTypes.number,
  is24Hour: PropTypes.bool,
  date: PropTypes.number,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  maxDate: PropTypes.number,
  minDate: PropTypes.number,
  mode: PropTypes.oneOf(['date', 'time', 'datetime']),
  formatInput: PropTypes.string,
  size: PropTypes.oneOf(['l', 'm', 's']),
  onDateChange: PropTypes.func
}

export default observer(themed(DatePicker))
