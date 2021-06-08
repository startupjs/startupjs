import React, { useMemo, useCallback } from 'react'
import { observer } from 'startupjs'
import { Row, Span, Div } from '@startupjs/ui'
import moment from 'moment'
import './index.styl'

export default observer(function Days ({
  uiDate,
  exactLocale,
  timezone,
  disabledDays,
  maxDate,
  minDate,
  range,
  onChangeDate
}) {
  const weekdaysShort = useMemo(() => {
    const data = moment
      .tz(uiDate, timezone)
      .locale(exactLocale)
      ._locale
      ._weekdaysShort

    return data.map(day => day.toUpperCase())
  }, [uiDate, timezone])

  const prepareMonthDays = useMemo(() => {
    const data = []

    const nowDate = moment.tz(timezone)

    const currentDay = moment
      .tz(uiDate, timezone)
      .locale(exactLocale)
      .startOf('M')
      .startOf('w')
      .hours(nowDate.hours())
      .minutes(nowDate.minutes())
      .seconds(nowDate.seconds())
      .milliseconds(nowDate.milliseconds())

    for (let weekIndex = 0; weekIndex < 6; weekIndex++) {
      const weekLine = []
      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        weekLine.push({
          label: currentDay.format('DD'),
          value: +currentDay
        })
        currentDay.add(1, 'd')
      }
      data.push(weekLine)
    }

    return data
  }, [uiDate, timezone])

  const isDisableDay = useCallback(value => {
    return disabledDays.some(item => moment(item).tz(timezone).isSame(value, 'd')) ||
      (minDate && moment(minDate).tz(timezone).isAfter(value, 'd')) ||
      (maxDate && moment(maxDate).tz(timezone).isBefore(value, 'd')
      )
  }, [disabledDays, maxDate, minDate, timezone])

  // const isActive = useCallback

  return pug`
    Row.row
      for shortDayName in weekdaysShort
        Div.cell(key=shortDayName)
          Span.shortName= shortDayName

    for week, weekIndex in prepareMonthDays
      Row.row(key='week-' + weekIndex)
        for day, dayIndex in prepareMonthDays[weekIndex]
          Div.cell(
            key=weekIndex + '-' + dayIndex
            styleName={
              cellActive: !range && moment.tz(day.value, timezone).isSame(uiDate, 'd'),
              cellActiveRangeStart: range && moment.tz(day.value, timezone).isSame(range[0], 'd'),
              cellActiveRange: range && moment.tz(day.value, timezone).isBetween(range[0], range[1], 'd'),
              cellActiveRangeEnd: range && moment.tz(day.value, timezone).isSame(range[1], 'd')
            }
            hoverStyleName='cellHover'
            disabled=isDisableDay(day.value)
            onPress=()=> onChangeDate(day.value)
          )
            Span.label(
              styleName={
                labelMute: !moment.tz(day.value, timezone).isSame(uiDate, 'M'),
                labelActive: range
                  ? moment.tz(day.value, timezone).isSame(range[0], 'd') ||
                    moment.tz(day.value, timezone).isSame(range[1], 'd')
                  : moment.tz(day.value, timezone).isSame(uiDate, 'd')
              }
            )= day.label
  `
})
