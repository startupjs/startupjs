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
  maxDate,
  minDate,
  onJump
}) {
  const quarterMonths = useMemo(() => {
    let months = moment(uiDate)
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

  const currentMonth = moment(uiDate).locale(exactLocale).format('MMM')

  function isDisabled ({ quarterIndex, monthIndex }) {
    const isAfterMaxDate = moment.tz(uiDate, timezone)
      .month((quarterIndex * 3) + monthIndex)
      .startOf('M').isAfter(maxDate)

    const isBeforeMinDate = moment.tz(uiDate, timezone)
      .month((quarterIndex * 3) + monthIndex)
      .endOf('M').isBefore(minDate)

    return isAfterMaxDate || isBeforeMinDate
  }

  return pug`
    Row.row
      Span(variant='description') Jump to a previous or future month

    for quarter, quarterIndex in quarterMonths
      Row.row(key=String(quarterIndex))
        for monthName, monthIndex in quarterMonths[quarterIndex]
          Div.cell(
            key=monthIndex + '-' + quarterIndex
            styleName={ cellActive: currentMonth === monthName }
            disabled=isDisabled({ quarterIndex, monthIndex })
            onPress=()=> onJump('month', (quarterIndex * 3) + monthIndex)
          )
            Span.label(
              styleName={ labelActive: currentMonth === monthName }
            )= monthName
  `
})
