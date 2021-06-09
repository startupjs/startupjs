import React, { useMemo } from 'react'
import { ScrollView } from 'react-native'
import { observer } from 'startupjs'
import { Row, Div, Span } from '@startupjs/ui'
import moment from 'moment'
import './index.styl'

export default observer(function TimeSelect ({
  date,
  exactLocale,
  timezone,
  onChangeDate
}) {
  const prepareHours = useMemo(() => new Array(24).fill(true).map((_, index) => index + 1), [])
  const prepareMinutes = useMemo(() => new Array(60).fill(true).map((_, index) => index + 1), [])

  function onHour (value) {
    const timestamp = +moment.tz(date, timezone).hours(value)
    onChangeDate && onChangeDate(timestamp)
  }

  function onMinute (value) {
    const timestamp = +moment.tz(date, timezone).minutes(value)
    onChangeDate && onChangeDate(timestamp)
  }

  return pug`
    Row.container
      ScrollView.case
        each hour in prepareHours
          - const isActive = moment.tz(date, timezone).hour() === hour
          Div.cell(
            styleName={ cellActive: isActive }
            hoverStyleName='cellHover'
            onPress=()=> onHour(hour)
          )
            Span(styleName={ labelActive: isActive })= hour

      ScrollView.case
        each minute in prepareMinutes
          - const isActive = moment.tz(date, timezone).minute() === minute
          Div.cell(
            styleName={ cellActive: isActive }
            hoverStyleName='cellHover'
            onPress=()=> onMinute(minute)
          )
            Span(styleName={ labelActive: isActive })= minute
  `
})
