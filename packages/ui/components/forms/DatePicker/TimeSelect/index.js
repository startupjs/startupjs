import React, { useMemo, useRef } from 'react'
import { observer } from 'startupjs'
import { Row, Div, Span, Icon } from '@startupjs/ui'
import Carousel from '@dmapper/carousel'
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import './index.styl'

export default observer(function TimeSelect ({
  date,
  exactLocale,
  timezone,
  is24Hour,
  hourInterval,
  minuteInterval,
  onChangeDate
}) {
  const refHourCarousel = useRef()
  const refMinuteCarousel = useRef()

  const currentDate = moment.tz(date, timezone).locale(exactLocale)
  const currentHour = currentDate.hour()
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

    return res
  }, [hourMode, hourInterval])

  const prepareMinutes = useMemo(() => {
    const res = []
    for (let i = 0; i < 60; i += minuteInterval) {
      res.push(i)
    }
    return res
  }, [minuteInterval])

  const currentMinute = moment.tz(date, timezone).locale(exactLocale).minute()

  function _onChangeDate ({ value, type }) {
    const timestamp = +moment.tz(date, timezone).set(type, value)
    onChangeDate && onChangeDate(timestamp)
  }

  function onChangeHourMode (mode) {
    if (hourMode === mode) return

    if (mode === 'PM') {
      const timeshtamp = +moment.tz(date, timezone).hours(currentHour + 12)
      onChangeDate && onChangeDate(timeshtamp)
    }

    if (mode === 'AM') {
      const timeshtamp = +moment.tz(date, timezone).hours(currentHour - 12)
      onChangeDate && onChangeDate(timeshtamp)
    }
  }

  return pug`
    Row.container
      Div.case
        Div.button(onPress=()=> refHourCarousel.current.toBack())
          Icon(icon=faChevronUp)
        Carousel(
          ref=refHourCarousel
          isEndless
          startIndex=hourInterval === 1
            ? (is24Hour ? currentHour : currentHour - 1)
            : 0
          variant='vertical'
          hasArrows=false
        )
          each item in prepareHours
            - const isActive = currentHour === item.value
            Div.cell(
              styleName={ cellActive: isActive }
              hoverStyleName='cellHover'
              onPress=()=> _onChangeDate({ value: item.value, type: 'hour' })
            )
              Span(styleName={ labelActive: isActive })
                = ('0' + item.label).slice(-2)
        Div.button(onPress=()=> refHourCarousel.current.toNext())
          Icon(icon=faChevronDown)

      Div.case
        Div.button(onPress=()=> refMinuteCarousel.current.toBack())
          Icon(icon=faChevronUp)
        Carousel(
          ref=refMinuteCarousel
          isEndless
          startIndex=minuteInterval === 1 ? currentMinute : 0
          variant='vertical'
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
          Icon(icon=faChevronDown)

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
