import React, { useMemo } from 'react'
import { observer } from 'startupjs'
import { Row, Span, Div } from '@startupjs/ui'
import moment from 'moment'
import './index.styl'

export default observer(function Years ({
  uiDate,
  timezone,
  onJump
}) {
  const matrixdYears = useMemo(() => {
    const data = []
    const currentYear = moment.tz(uiDate, timezone).startOf('Y').add(-7, 'y')

    for (let li = 0; li < 5; li++) {
      const line = []
      for (let i = 0; i < 3; i++) {
        line.push(currentYear.format('YYYY'))
        currentYear.add(1, 'Y')
      }
      data.push(line)
    }

    return data
  }, [uiDate, timezone])

  const currentYear = moment.tz(uiDate, timezone).year()

  return pug`
    Row.row
      Span(variant='description') Jump to a previous or future year

    for line, lineIndex in matrixdYears
      Row.row(key=String(lineIndex))
        for year, yearIndex in matrixdYears[lineIndex]
          Div.cell(
            key=yearIndex + '-' + lineIndex
            styleName={ cellActive: currentYear === +year }
            onPress=()=> onJump('year', year)
          )
            Span.label(
              styleName={ labelActive: currentYear === +year }
            )= year
  `
})
