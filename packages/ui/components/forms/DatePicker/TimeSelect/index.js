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

  const [uiDate, $uiDate] = useValue(date)
  const currentDate = moment(uiDate).locale(exactLocale)
  const currentHour = currentDate.hour()
  const currentMinute = currentDate.minute()
  const hourMode = currentDate.locale('en-US').format('A')

  const prepareHours = useMemo(() => {
    const res = []

    if (is24Hour) {
      for (let index = 0; index < 24; index += hourInterval) {
        res.push({ label: index, value: index })
      }
    } else {
      for (let index = 0; index < 11; index += hourInterval) {
        res.push({
          label: index + 1,
          value: +moment(`${index + 1} ${hourMode}`, ['hh A']).format('HH').slice(0, 2)
        })
      }

      res.push({
        label: 12,
        value: res[res.length - 1].value - 11
      })
    }

    return res.filter(item => {
      const timeshtamp = +moment(uiDate).set('hour', item.value)
        .set('minutes', 59).set('seconds', 0)
      return timeshtamp >= minDate && timeshtamp <= maxDate
    })
  }, [uiDate, hourMode, hourInterval])

  const prepareMinutes = useMemo(() => {
    const res = []
    for (let i = 0; i < 60; i += minuteInterval) {
      const timeshtamp = +moment(uiDate).set('minutes', i).set('seconds', 0)
      if (timeshtamp >= minDate && timeshtamp <= maxDate) {
        res.push(i)
      }
    }
    return res
  }, [uiDate, minuteInterval])

  function _onChangeDate ({ value, type }) {
    const timestamp = +moment.tz(uiDate, timezone).set(type, value)
    onChangeDate && onChangeDate(timestamp)
  }

  function onChangeHourMode (mode) {
    if (hourMode === mode) return

    if (mode === 'PM') {
      const timeshtamp = +moment(uiDate).hours(currentHour + 12)
      $uiDate.set(timeshtamp)
    }

    if (mode === 'AM') {
      const timeshtamp = +moment(uiDate).hours(currentHour - 12)
      $uiDate.set(timeshtamp)
    }
  }

  const startHour = is24Hour
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
          each item in prepareHours
            - const isActive = moment(date).hour() === item.value
            Div.cell(
              styleName={ cellActive: isActive }
              hoverStyleName='cellHover'
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
          each value in prepareMinutes
            - const isActive = currentMinute === value
            Div.cell(
              styleName={ cellActive: isActive }
              hoverStyleName='cellHover'
              onPress=()=> _onChangeDate({ value, type: 'minute' })
            )
              Span(styleName={ labelActive: isActive })
                = ('0' + value).slice(-2)
        Div.button(onPress=()=> refMinuteCarousel.current.toNext())
          Icon(icon=layoutWidth > STYLES.media.mobile ? faChevronDown : faChevronRight)

      if !is24Hour
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
