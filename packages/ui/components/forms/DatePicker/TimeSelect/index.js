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

  const prepareHours = useMemo(() => {
    const res = []
    for (let i = 0; i < (is24Hour ? 24 : 12); i += hourInterval) {
      res.push(is24Hour ? i : i + 1)
    }
    return res
  }, [hourInterval])

  const prepareMinutes = useMemo(() => {
    const res = []
    for (let i = 0; i < 60; i += minuteInterval) {
      res.push(i)
    }
    return res
  }, [minuteInterval])

  const hour = moment.tz(date, timezone).locale(exactLocale).hour()
  const hourMode = hour > 12 ? 'PM' : 'AM'
  const currentHour = is24Hour
    ? hour
    : (hourMode === 'AM' ? hour : hour - 12)

  const currentMinute = moment.tz(date, timezone).locale(exactLocale).minute()

  function _onChangeDate ({ item, type }) {
    if (hourMode === 'PM') item += 12

    const timestamp = +moment.tz(date, timezone).set(type, item)
    onChangeDate && onChangeDate(timestamp)
  }

  function onChangeHourMode (mode) {
    if (hourMode === mode) return

    if (mode === 'PM') {
      const timeshtamp = +moment.tz(date, timezone).hours(currentHour + 12)
      onChangeDate && onChangeDate(timeshtamp)
    }

    if (mode === 'AM') {
      const timeshtamp = +moment.tz(date, timezone).hours(currentHour)
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
            - const isActive = currentHour === item
            Div.cell(
              styleName={ cellActive: isActive }
              hoverStyleName='cellHover'
              onPress=()=> _onChangeDate({ item, type: 'hour' })
            )
              Span(styleName={ labelActive: isActive })
                = ('0' + item).slice(-2)
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
          each item in prepareMinutes
            - const isActive = currentMinute === item
            Div.cell(
              styleName={ cellActive: isActive }
              hoverStyleName='cellHover'
              onPress=()=> _onChangeDate({ item, type: 'minute' })
            )
              Span(styleName={ labelActive: isActive })
                = ('0' + item).slice(-2)
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
