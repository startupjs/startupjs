import React, { useEffect, useMemo, useRef } from 'react'
import { FlatList } from 'react-native'
import { observer } from 'startupjs'
import { Row, Div, Span } from '@startupjs/ui'
import moment from 'moment'

// TODO: add displayTimeVariant
export default observer(function TimeSelect ({
  date,
  layoutWidth,
  exactLocale,
  timezone,
  is24Hour,
  minDate,
  maxDate,
  minuteInterval,
  onChangeDate
}) {
  const refFlatList = useRef()

  const _is24Hour = useMemo(() => {
    if (is24Hour != null) return is24Hour
    const lt = moment().locale(exactLocale)._locale._longDateFormat.LT
    return !(new RegExp(/a/i).test(lt))
  }, [is24Hour, exactLocale])

  useEffect(() => scrollToIndex(), [date])

  function scrollToIndex () {
    const _date = +moment.tz(date, timezone).seconds(0).milliseconds(0)
    const index = preparedData.findIndex(item => _date === item.value)
    refFlatList.current.scrollToIndex({ animated: false, index })
  }

  const preparedData = useMemo(() => {
    const res = []

    let currentTimestamp = +moment.tz(date, timezone).locale(exactLocale).startOf('d')
    const endTimestamp = +moment.tz(date, timezone).locale(exactLocale).endOf('d')
    const intervalTimestamp = minuteInterval * 60 * 1000

    const format = _is24Hour
      ? moment.tz(date, timezone).locale(exactLocale)._locale._longDateFormat.LT
      : 'hh:mm A'

    while (currentTimestamp < endTimestamp) {
      res.push({
        label: moment.tz(currentTimestamp, timezone).locale(exactLocale).format(format),
        value: currentTimestamp,
        disabled: (currentTimestamp > maxDate) || (currentTimestamp < minDate)
      })
      currentTimestamp += intervalTimestamp
    }

    return res
  }, [date])

  function renderItem ({ item }) {
    const isActive = date === item.value
    return pug`
      Div.cell(
        styleName={ cellActive: isActive }
        hoverStyleName='cellHover'
        disabled=item.disabled
        onPress=()=> onChangeDate(item.value)
      )
        Span(styleName={ labelActive: isActive })
          = item.label
    `
  }

  return pug`
    Row.container
      Div.case
        FlatList(
          ref=refFlatList
          data=preparedData
          renderItem=renderItem
          getItemLayout=(data, index) => (
            { length: 40, offset: 40 * index, index }
          )
          keyExtractor=item=> item.value
        )
  `
})
