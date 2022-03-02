import React, { useCallback, useMemo } from 'react'
import { FlatList } from 'react-native'
import { observer, useValue } from 'startupjs'
import { Row, Div, Span, Button, Popover, Icon } from '@startupjs/ui'
import { faAngleLeft, faAngleRight, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import STYLES from './index.styl'

const yearsItemStyle = STYLES['years-item']
const YEAR_ITEM_HEIGHT = yearsItemStyle.height

export default observer(function Header ({
  uiDate,
  exactLocale,
  timezone,
  minDate,
  maxDate,
  $slide,
  $uiDate
}) {
  const monthName = moment.tz(uiDate, timezone).locale(exactLocale).format('MMM')

  const onChangeMonth = useCallback((value) => {
    const ts = +moment($uiDate.get()).add('month', value)
    $uiDate.set(ts)
  }, [])

  const isPrevDisabled = minDate
    ? +moment.tz($uiDate.get(), timezone).endOf('month').add('month', -1) < minDate
    : false

  const isNextDisabled = maxDate
    ? +moment($uiDate.get()).startOf('month').add('month', 1) > maxDate
    : false

  return pug`
    Row.header
      Row(vAlign='center')
        Span.month(bold)= monthName
        Years.years(
          timezone=timezone
          minDate=minDate
          maxDate=maxDate
          $uiDate=$uiDate
        )
      Row.actions
        Button.button(
          color='darkLight'
          variant='text'
          disabled=isPrevDisabled
          icon=faAngleLeft
          onPress=()=> onChangeMonth(-1)
        )
        Button.button(
          color='darkLight'
          variant='text'
          disabled=isNextDisabled
          icon=faAngleRight
          onPress=()=> onChangeMonth(1)
        )
  `
})

const Years = observer(function YearsComponent ({
  style,
  minDate,
  maxDate,
  timezone,
  $uiDate
}) {
  const [, $visible] = useValue(false)
  const minYear = minDate ? moment.tz(minDate, timezone).year() : 1950
  const maxYear = maxDate ? moment.tz(maxDate, timezone).year() : 2050
  const yearsDiff = maxYear - minYear

  if (!yearsDiff) {
    return pug`
      Div(style=style)
        Span.year(bold)= maxYear
    `
  }

  const onChangeYear = useCallback((year) => {
    const ts = +moment($uiDate.get()).year(year)
    $uiDate.set(ts)
    $visible.set(false)
  }, [])

  const years = useMemo(() => {
    return new Array(yearsDiff + 1).fill(minYear).map((year, index) => {
      return year + index
    })
  }, [yearsDiff, minYear])

  const getItemLayout = useCallback((data, index) => {
    return {
      offset: YEAR_ITEM_HEIGHT * index,
      length: YEAR_ITEM_HEIGHT,
      index
    }
  })

  function renderYears () {
    return pug`
      FlatList(
        data=years
        renderItem=renderYear
        keyExtractor=item => item
        getItemLayout=getItemLayout
      )
    `
  }

  function renderYear ({ item }) {
    return pug`
      Div.years-item(
        variant='higlight'
        onPress=() => onChangeYear(item)
      )
        Span= item
    `
  }

  return pug`
    Div(style=style)
      Popover(
        $visible=$visible
        renderContent=renderYears
        attachmentStyleName='years-popover'
      )
        Row(vAlign='center')
          Span.year(bold)= moment.tz($uiDate.get(), timezone).year()
          Icon(icon=faCaretDown)
  `
})
