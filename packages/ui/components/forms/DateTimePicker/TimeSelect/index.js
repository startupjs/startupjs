import React, { useEffect, useMemo, useRef, useImperativeHandle } from 'react'
import { FlatList } from 'react-native'
import { observer } from 'startupjs'
import { Div, Span } from '@startupjs/ui'
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
}, ref) {
  const refFlatList = useRef()

  // we are looking for 'a' in current locale
  // to figure out whether to apply 12 hour format
  const _is24Hour = useMemo(() => {
    if (is24Hour != null) return is24Hour
    const lt = moment().locale(exactLocale)._locale._longDateFormat.LT
    return !(new RegExp(/a/i).test(lt))
  }, [is24Hour, exactLocale])

  useImperativeHandle(ref, () => ({ scrollToIndex }), [])
  useEffect(() => scrollToIndex(), [])

  function scrollToIndex (_date = date) {
    const dateWithoutSeconds = +moment.tz(_date, timezone)
    const index = preparedData.findIndex(item => dateWithoutSeconds === item.value)
    if (index === -1) return
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

  const isMobile = layoutWidth < STYLES.media.mobile
  const length = isMobile ? STYLES.cell.width : STYLES.cell.height

  return pug`
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
}, { forwardRef: true })
