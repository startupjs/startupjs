import React, { useMemo, useRef } from 'react'
import { observer, useValue } from 'startupjs'
import { Row, Div, Span, Icon, Carousel } from '@startupjs/ui'
import {
  faChevronUp,
  faChevronDown,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import STYLES from './index.styl'

// TODO: "refHourCarousel.current.toIndex" before onChangeDate with minDate, maxDate
// add displayTimeVariant
export default observer(function TimeSelect ({
  date,
  layoutWidth,
  exactLocale,
  timezone,
  is24Hour,
  minDate,
  maxDate,
  // hourInterval,
  minuteInterval,
  onChangeDate
}) {
  const refHourCarousel = useRef()
  // const refMinuteCarousel = useRef()

  const _is24Hour = useMemo(() => {
    if (is24Hour != null) return is24Hour
    const lt = moment().locale(exactLocale)._locale._longDateFormat.LT
    return !(new RegExp(/a/i).test(lt))
  }, [is24Hour, exactLocale])

  const [uiDate] = useValue(date)
  const currentDate = moment.tz(uiDate, timezone).locale(exactLocale)
  const currentHour = currentDate.hour()
  // const hourMode = currentHour > 11 ? 'PM' : 'AM'

  const preparedData = useMemo(() => {
    const res = []

    let currentTimestamp = +moment().tz(timezone).startOf('d')
    const endTimestamp = +moment().tz(timezone).endOf('d')
    const intervalTimestamp = +new Date(null).setMinutes(5)

    const format = moment().locale(exactLocale).tz(timezone)._locale._longDateFormat.LT

    while (currentTimestamp < endTimestamp) {
      res.push({
        label: moment(currentTimestamp).tz(timezone).format(format),
        value: currentTimestamp
      })
      currentTimestamp += intervalTimestamp
    }

    return res
  }, [])

  function _onChangeDate ({ value }) {
    onChangeDate && onChangeDate(value)
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
          startIndex=startHour
          variant=layoutWidth > STYLES.media.mobile ? 'vertical' : 'horizontal'
          hasArrows=false
        )
          each item in preparedData
            - const isActive = moment.tz(date, timezone).hour() === item.value
            Div.cell(
              styleName={ cellActive: isActive }
              hoverStyleName='cellHover'
              disabled=item.disabled
              onPress=()=> _onChangeDate({ value: item.value, type: 'hour' })
            )
              Span(styleName={ labelActive: isActive })
                = item.label
        Div.button(onPress=()=> refHourCarousel.current.toNext())
          Icon(icon=layoutWidth > STYLES.media.mobile ? faChevronDown : faChevronRight)
  `
})
