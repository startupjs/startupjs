import React, { useEffect, useMemo, useRef } from 'react'
import { FlatList } from 'react-native'
import { observer } from 'startupjs'
import { Row, Div, Span } from '@startupjs/ui'
import moment from 'moment'
import STYLES from './index.styl'

// TODO: add displayTimeVariant
export default observer(function TimeSelect ({
  date,
  layoutWidth,
  exactLocale,
  timezone,
  is24Hour,
  minDate,
  maxDate,
  timeInterval,
  onChangeDate
}) {
  const refFlatList = useRef()

  // we are looking for 'a' in current locale
  // to figure out whether to apply 12 hour fore
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
    const intervalTimestamp = timeInterval * 60 * 1000

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
    const isActive = +moment(date).startOf('m') === item.value
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

  const isMobile = layoutWidth < STYLES.media.mobile
  const length = isMobile ? STYLES.cell.width : STYLES.cell.height

  return pug`
    Row.container
      Div.case
        FlatList(
          ref=refFlatList
          data=preparedData
          renderItem=renderItem
          horizontal=isMobile
          getItemLayout=(data, index) => ({
            offset: length * index,
            length,
            index
          })
          keyExtractor=item=> item.value
        )
  `
})
