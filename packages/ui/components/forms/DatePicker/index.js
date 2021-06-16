import React, { useMemo, useCallback, useState } from 'react'
import { observer, useValue } from 'startupjs'
import { Div, Divider, TextInput, Popover } from '@startupjs/ui'
import PropTypes from 'prop-types'
import moment from 'moment'
import 'moment/min/locales'
import getLocale from './getLocale'
import Calendar from './Calendar'
import TimeSelect from './TimeSelect'
import themed from '../../../theming/themed'
import './index.styl'

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

  const _formatInput = useMemo(() => {
    if (formatInput) return formatInput
    if (mode === 'datetime') return 'YYYY.MM.DD HH:mm'
    if (mode === 'date') return 'YYYY.MM.DD'
    if (mode === 'time') return 'HH:mm'
  }, [formatInput])

  const exactLocale = useMemo(() => locale || getLocale() || 'en-US', [locale])

  function getFormatDate () {
    return moment
      .tz(date, timezone)
      .locale(exactLocale)
      .format(_formatInput)
  }

  const _onChangeDate = useCallback(value => {
    onChangeDate && onChangeDate(value)
    $visible.set(false)
  }, [onChangeDate])

  function onFocus () {
    setTextInput(getFormatDate())
    $visible.set(true)
  }

  function onDismiss () {
    if (!visible) return

    const timeshtamp = moment(textInput, _formatInput)

    if (timeshtamp.isValid()) {
      onChangeDate(+timeshtamp)
    }

    $visible.set(false)
    setTextInput('')
  }

  function onChangeText (text) {
    setTextInput(text)
  }

  // TODO: New API Popover
  return pug`
    Popover(
      visible=visible
      onDismiss=onDismiss
    )
      Popover.Caption
        if renderCaption
          = renderCaption()
        else
          TextInput(
            style=style
            disabled=disabled
            label=label
            size=size
            placeholder=placeholder
            value=visible ? textInput : getFormatDate()
            onFocus=onFocus
            onChangeText=onChangeText
          )

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
          Divider.divider(variant='vertical')

        if (mode === 'time') || (mode === 'datetime')
          TimeSelect(
            date=date
            timezone=timezone
            exactLocale=exactLocale
            is24Hour=is24Hour
            hourInterval=hourInterval
            minuteInterval=minuteInterval
            onChangeDate=_onChangeDate
          )
  `
}

DatePicker.defaultProps = {
  mode: 'datetime',
  size: 'm',
  maxDate: moment().add(100, 'year').valueOf(),
  is24Hour: true,
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
