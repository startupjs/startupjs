import React, { useMemo, useCallback } from 'react'
import { observer, useValue } from 'startupjs'
import { Div, Divider, Popover, TextInput } from '@startupjs/ui'
import PropTypes from 'prop-types'
import moment from 'moment'
import 'moment/min/locales'
import getLocale from './getLocale'
import Calendar from './Calendar'
import TimeSelect from './TimeSelect'
import themed from '../../../theming/themed'
import './index.styl'

function DatePicker ({
  style, // ???
  formatInput,
  minuteInterval, // ???
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

  const _formatInput = useMemo(() => {
    if (formatInput) return formatInput
    if (mode === 'datetime') return 'YYYY.MM.DD HH:mm'
    if (mode === 'date') return 'YYYY.MM.DD'
    if (mode === 'time') return 'HH:mm'
  }, [formatInput])
  const exactLocale = useMemo(() => locale || getLocale() || 'en-US', [locale])

  function getformatDate () {
    return moment
      .tz(date, timezone)
      .locale(exactLocale)
      .format(_formatInput)
  }

  const _onChangeDate = useCallback(value => {
    onChangeDate && onChangeDate(value)
    $visible.set(false)
  }, [onChangeDate])

  function onBlur () {

  }

  // TODO: New API Popover
  return pug`
    Popover(
      visible=visible
      onDismiss=()=> $visible.set(false)
    )
      Popover.Caption
        if renderCaption
          = renderCaption()
        else
          TextInput(
            disabled=disabled
            label=label
            size=size
            placeholder=placeholder
            value=getformatDate()
            onBlur=onBlur
            onFocus=()=> $visible.set(true)
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
            onChangeDate=_onChangeDate
          )
  `
}

DatePicker.defaultProps = {
  mode: 'datetime',
  maxDate: moment().add(100, 'year').valueOf(),
  size: 'm'
}

DatePicker.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]), // ?
  minuteInterval: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30]), // -
  // hourInterval: []
  // minuteInterval: []
  is24Hour: PropTypes.bool, // -

  cancelButtonText: PropTypes.string, // ios
  confirmButtonText: PropTypes.string, // ios

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
