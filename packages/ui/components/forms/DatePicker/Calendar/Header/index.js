import React, { useCallback } from 'react'
import { observer } from 'startupjs'
import { Row, Div, Span, Button } from '@startupjs/ui'
import {
  // faAngleDoubleLeft,
  // faAngleDoubleRight,
  faAngleLeft,
  faAngleRight,
  faCalendarDay
} from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import './index.styl'

export default observer(function Header ({
  uiDate,
  exactLocale,
  timezone,
  $slide,
  $uiDate
}) {
  const currentMonthName = moment.tz(uiDate, timezone).locale(exactLocale).format('MMM')
  const currentYear = moment.tz(uiDate, timezone).format('yyyy')

  const onMove = useCallback((unitKey, value) => {
    const timestamp = +moment
      .tz(uiDate, timezone)
      .add(unitKey, value)

    $uiDate.set(timestamp)
  }, [uiDate, timezone])

  const toToday = useCallback(() => {
    $uiDate.set(moment.now())
    $slide.set('days')
  }, [uiDate, timezone])

  return pug`
    Row.header
      Row
        Div(onPress=()=> $slide.set('months'))
          Span.month(bold)= currentMonthName
        Div(
          pushed='xs'
          onPress=()=> $slide.set('years')
        )
          Span.year(bold)= currentYear

      Row.actions
        // Button(
        //  color='darkLight'
        //  variant='text'
        //  icon=faAngleDoubleLeft
        //  onPress=()=> onMove('year', -1)
        // )
        Button(
          color='darkLight'
          variant='text'
          icon=faAngleLeft
          onPress=()=> onMove('month', -1)
        )
        Button(
          pushed='xs'
          color='darkLight'
          variant='text'
          icon=faCalendarDay
          onPress=toToday
        )
        Button(
          pushed='xs'
          color='darkLight'
          variant='text'
          icon=faAngleRight
          onPress=()=> onMove('month', 1)
        )
        // Button(
        //  pushed='xs'
        //  color='darkLight'
        //  variant='text'
        //  icon=faAngleDoubleRight
        //  onPress=()=> onMove('year', 1)
        // )
  `
})
