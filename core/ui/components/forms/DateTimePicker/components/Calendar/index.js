import React from 'react'
import { pug, observer, $ } from 'startupjs'
import { Div } from '@startupjs/ui'
import moment from 'moment'
import Header from './Header'
import Days from './Days'
import 'moment/min/locales'

function Calendar ({
  date,
  disabledDays = [],
  exactLocale,
  timezone,
  maxDate,
  minDate,
  range,
  testID,
  onChangeDate
}) {
  const $uiDate = $(+moment(date).seconds(0).milliseconds(0))

  return pug`
    Div(testID=testID)
      Header(
        uiDate=$uiDate.get()
        exactLocale=exactLocale
        timezone=timezone
        minDate=minDate
        maxDate=maxDate
        $uiDate=$uiDate
      )
      Days(
        date=date
        uiDate=$uiDate.get()
        exactLocale=exactLocale
        timezone=timezone
        range=range
        minDate=minDate
        maxDate=maxDate
        disabledDays=disabledDays
        onChangeDate=onChangeDate
      )
  `
}

export default observer(Calendar)
