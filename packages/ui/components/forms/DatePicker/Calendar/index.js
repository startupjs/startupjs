import React, { useCallback } from 'react'
import { observer, useValue } from 'startupjs'
import { Div } from '@startupjs/ui'
import moment from 'moment'
import Header from './Header'
import { Days, Months, Years } from './slides'
import 'moment/min/locales'
import './index.styl'

const SLIDES = {
  days: Days,
  months: Months,
  years: Years
}

function Calendar ({
  date,
  disabledDays = [],
  exactLocale,
  timezone,
  maxDate,
  minDate,
  range,
  onChangeDate
}) {
  const [uiDate, $uiDate] = useValue(date)
  const [slide, $slide] = useValue('days')

  const onJump = useCallback((unitKey, value) => {
    const timestamp = +moment
      .tz(uiDate, timezone)
      .locale(exactLocale)
      .set(unitKey, value)

    $uiDate.set(timestamp)
    $slide.set('days')
  }, [uiDate, timezone])

  const Slide = SLIDES[slide]

  return pug`
    Div
      Header(
        uiDate=uiDate
        exactLocale=exactLocale
        timezone=timezone
        $slide=$slide
        $uiDate=$uiDate
      )

      Slide(
        uiDate=uiDate
        exactLocale=exactLocale
        timezone=timezone
        range=range
        minDate=minDate
        maxDate=maxDate
        disabledDays=disabledDays
        onJump=onJump
        onChangeDate=onChangeDate
      )
  `
}

export default observer(Calendar)
