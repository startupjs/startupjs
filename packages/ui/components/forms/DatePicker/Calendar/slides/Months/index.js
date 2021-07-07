import React, { useMemo } from 'react'
import { observer } from 'startupjs'
import { Row, Span, Div } from '@startupjs/ui'
import moment from 'moment'
import './index.styl'

const MONTHS_PER_QUARTER = 3

export default observer(function Months ({
  uiDate,
  exactLocale,
  timezone,
  onJump
}) {
  const matrixdMonths = useMemo(() => {
    let months = moment
      .tz(uiDate, timezone)
      .locale(exactLocale)
      ._locale
      ._monthsShort

    months = months.standalone ? months.standalone : months

    const data = []
    for (let i = 0; i < months.length; i += MONTHS_PER_QUARTER) {
      const quarter = months.slice(i, i + MONTHS_PER_QUARTER)
      data.push(quarter)
    }

    return data
  }, [uiDate, timezone])

  const currentMonth = moment.tz(uiDate, timezone).locale(exactLocale).format('MMM')

  return pug`
    Row.row
      Span(variant='description') Jump to a previous or future month

    for quarter, quarterIndex in matrixdMonths
      Row.row(key=String(quarterIndex))
        for monthName, monthIndex in matrixdMonths[quarterIndex]
          Div.cell(
            key=monthIndex + '-' + quarterIndex
            styleName={ cellActive: currentMonth === monthName }
            onPress=()=> onJump('month', (quarterIndex * 3) + monthIndex)
          )
            Span.label(
              styleName={ labelActive: currentMonth === monthName }
            )= monthName
  `
})
