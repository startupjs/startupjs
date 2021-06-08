import React, { useMemo, useCallback } from 'react'
import { observer, useValue } from 'startupjs'
import { Div, Card, Divider, Span, Popover } from '@startupjs/ui'
import moment from 'moment'
import 'moment/min/locales'
import getLocale from './getLocale'
import Calendar from './Calendar'
import TimeSelect from './TimeSelect'
import './index.styl'

function DatePicker ({
  style, // 1

  mode, // ['date', 'time', 'datetime']
  renderCaption, // remove InputComponent

  locale, // new
  range, // new
  timezone = moment.tz.guess(), // new
  disabledDays = [], // new

  date, // 1
  disabled, // 1
  label, // -
  placeholder, // -
  maxDate, // + default: moment().add(100, 'year').valueOf()
  minDate, // 1
  onChangeDate // 1
}) {
  const [visible, $visible] = useValue(false)

  const exactLocale = useMemo(() => locale || getLocale() || 'en', [locale])

  const _onChangeDate = useCallback(value => {
    onChangeDate && onChangeDate(value)
    $visible.set(false)
  }, [onChangeDate])

  console.log(date)

  return pug`
    Popover(
      visible=visible
      onDismiss=()=> $visible.set(false)
    )
      Popover.Caption
        if renderCaption
          = renderCaption()
        else
          // inputStyle
          // TextInput
          Div(
            style=style
            disabled=disabled
            onPress=()=> $visible.set(true)
          )
            Span 123

      Card.content
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

        Divider.divider(variant='vertical')

        TimeSelect(
          date=date
          timezone=timezone
          exactLocale=exactLocale
          onChangeDate=_onChangeDate
        )
  `
}

// propTypes

export default observer(DatePicker)
