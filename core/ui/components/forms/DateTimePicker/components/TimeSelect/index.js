import React, { useEffect, useMemo, useRef, useImperativeHandle } from 'react'
import { pug, observer } from 'startupjs'
import { Div, FlatList, Span } from '@startupjs/ui'
import moment from 'moment'
import STYLES from './index.styl'

// TODO: add displayTimeVariant
export default observer(function TimeSelect ({
  date,
  exactLocale,
  timezone,
  is24Hour,
  minDate,
  maxDate,
  timeInterval,
  onChangeDate
}, ref) {
  const refScroll = useRef()

  // we are looking for 'a' in current locale
  // to figure out whether to apply 12 hour format
  const _is24Hour = useMemo(() => {
    if (is24Hour != null) return is24Hour
    const lt = moment().locale(exactLocale)._locale._longDateFormat.LT
    return !/a/i.test(lt)
  }, [is24Hour, exactLocale])

  useImperativeHandle(ref, () => ({ scrollToIndex }), [])
  useEffect(() => scrollToIndex(), [])

  function scrollToIndex (_date = date) {
    const date = +moment.tz(_date, timezone)
    const index = preparedData.findIndex(item => date === item.value)
    if (index === -1) return
    refScroll.current.scrollToIndex({ index, animated: false })
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
    const isActive = +moment(date) === item.value

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

  const length = STYLES.cell.height

  return pug`
    FlatList(
      ref=refScroll
      data=preparedData
      renderItem=renderItem
      getItemLayout=(data, index) => ({
        offset: length * index,
        length,
        index
      })
      keyExtractor=item=> String(item.value)
    )
  `
}, { forwardRef: true })
