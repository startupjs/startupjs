import React, { useMemo, useRef } from 'react'
import { observer, useValue } from 'startupjs'
import { Row, Div, Span, Icon } from '@startupjs/ui'
import Carousel from '@dmapper/carousel'
import {
  faChevronUp,
  faChevronDown,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import STYLES from './index.styl'

// TODO: "refHourCarousel.current.toIndex" before onChangeDate with minDate, maxDate
export default observer(function TimeSelect ({
  date,
  layoutWidth,
  exactLocale,
  timezone,
  is24Hour,
  minDate,
  maxDate,
  hourInterval,
  minuteInterval,
  onChangeDate
}) {
  const refHourCarousel = useRef()
  const refMinuteCarousel = useRef()

  const _is24Hour = useMemo(() => {
    if (is24Hour != null) return is24Hour
    const lt = moment().locale(exactLocale)._locale._longDateFormat.LT
    return !(new RegExp(/a/i).test(lt))
  }, [is24Hour, exactLocale])

  const [uiDate] = useValue(date)
  const currentDate = moment.tz(uiDate, timezone).locale(exactLocale)
  const currentHour = currentDate.hour()
  const currentMinute = currentDate.minute()
  const hourMode = currentHour > 11 ? 'PM' : 'AM'

  const preparedHours = useMemo(() => {
    const res = []

    if (_is24Hour) {
      for (let index = 0; index < 24; index += hourInterval) {
        res.push({ label: index, value: index })
      }
    } else {
      res.push({
        label: 12,
        value: +moment(`12 ${hourMode}`, ['hh A']).format('HH').slice(0, 2)
      })

      for (let index = 1; index <= 11; index += hourInterval) {
        res.push({
          label: index,
          value: +moment(`${index} ${hourMode}`, ['hh A']).format('HH').slice(0, 2)
        })
      }
    }

    const minHour = moment(minDate).startOf('h')

    return res.map(item => {
      const _date = moment.tz(date, timezone).hours(item.value).startOf('h')

      item.disabled = (minDate && moment.tz(minHour, timezone).isAfter(_date)) ||
        (maxDate && moment.tz(maxDate, timezone).isBefore(_date))
      return item
    })
  }, [uiDate, date, hourMode, hourInterval, timezone])

  const preparedMinutes = useMemo(() => {
    const res = []
    for (let index = 0; index < 60; index += minuteInterval) {
      const item = { value: index }
      const _date = moment.tz(date, timezone).minutes(index).startOf('m')

      item.disabled = (minDate && moment.tz(minDate, timezone).isAfter(_date)) ||
        (maxDate && moment.tz(maxDate, timezone).isBefore(_date))

      res.push(item)
    }
    return res
  }, [uiDate, date, minuteInterval, timezone])

  function _onChangeDate ({ value, type }) {
    const timestamp = +moment.tz(uiDate, timezone).set(type, value)
    onChangeDate && onChangeDate(timestamp)
  }

  function onChangeHourMode (mode) {
    if (hourMode === mode) return

    if (mode === 'PM') {
      const timeshtamp = +moment(uiDate).hours(currentHour + 12)
      onChangeDate(timeshtamp)
    }

    if (mode === 'AM') {
      const timeshtamp = +moment(uiDate).hours(currentHour - 12)
      onChangeDate(timeshtamp)
    }
  }

  const startHour = _is24Hour
    ? currentHour
    : (+currentDate.locale('en-US').format('hh A').slice(0, 2)) - 1

  return pug`
    Row.container
      Div.case
        Div.button(onPress=()=> refHourCarousel.current.toBack())
          Icon(icon=layoutWidth > STYLES.media.mobile ? faChevronUp : faChevronLeft)
        Carousel(
          ref=refHourCarousel
          isEndless
          startIndex=hourInterval === 1 ? startHour : 0
          variant=layoutWidth > STYLES.media.mobile ? 'vertical' : 'horizontal'
          hasArrows=false
        )
          each item in preparedHours
            - const isActive = moment.tz(date, timezone).hour() === item.value
            Div.cell(
              styleName={ cellActive: isActive }
              hoverStyleName='cellHover'
              disabled=item.disabled
              onPress=()=> _onChangeDate({ value: item.value, type: 'hour' })
            )
              Span(styleName={ labelActive: isActive })
                = ('0' + item.label).slice(-2)
        Div.button(onPress=()=> refHourCarousel.current.toNext())
          Icon(icon=layoutWidth > STYLES.media.mobile ? faChevronDown : faChevronRight)

      Div.case
        Div.button(onPress=()=> refMinuteCarousel.current.toBack())
          Icon(icon=layoutWidth > STYLES.media.mobile ? faChevronUp : faChevronLeft)
        Carousel(
          ref=refMinuteCarousel
          isEndless
          startIndex=minuteInterval === 1 ? currentMinute : 0
          variant=layoutWidth > STYLES.media.mobile ? 'vertical' : 'horizontal'
          hasArrows=false
        )
          each item in preparedMinutes
            - const isActive = currentMinute === item.value
            Div.cell(
              styleName={ cellActive: isActive }
              hoverStyleName='cellHover'
              disabled=item.disabled
              onPress=()=> _onChangeDate({ value: item.value, type: 'minute' })
            )
              Span(styleName={ labelActive: isActive })
                = ('0' + item.value).slice(-2)
        Div.button(onPress=()=> refMinuteCarousel.current.toNext())
          Icon(icon=layoutWidth > STYLES.media.mobile ? faChevronDown : faChevronRight)

      if !_is24Hour
        Div.case
          Div.cell(
            styleName={ cellActive: hourMode === 'AM' }
            hoverStyleName='cellHover'
            onPress=()=> onChangeHourMode('AM')
          )
            Span(styleName={ labelActive: hourMode === 'AM' })
              | AM
          Div.cell(
            styleName={ cellActive: hourMode === 'PM' }
            hoverStyleName='cellHover'
            onPress=()=> onChangeHourMode('PM')
          )
            Span(styleName={ labelActive: hourMode === 'PM' })
              | PM
  `
})
