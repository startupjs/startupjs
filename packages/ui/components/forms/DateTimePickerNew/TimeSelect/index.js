import React, { useMemo, useRef, useState } from 'react'
import { FlatList } from 'react-native'
import { observer } from 'startupjs'
import { Row, Div, Span, Icon } from '@startupjs/ui'
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import './index.styl'

const ITEM_HEIGHT = 40
const COUNT_VISIBLE_ITEM = 6

export default observer(function TimeSelect ({
  date,
  exactLocale,
  timezone,
  onChangeDate
}) {
  const refScrollHour = useRef()
  const refScrollMinute = useRef()

  const currentHour = moment.tz(date, timezone).locale(exactLocale).format('HH')
  const currentMinute = moment.tz(date, timezone).locale(exactLocale).format('mm')

  const [scrollIndexHour, setScrollIndexHour] = useState(parseInt(currentHour) - 1)
  const [scrollIndexMinute, setScrollIndexMinute] = useState(parseInt(currentMinute) - 1)

  function _onChangeDate ({ item, type }) {
    const timestamp = +moment.tz(date, timezone).set(type, item)
    onChangeDate && onChangeDate(timestamp)
  }

  function onActionUp (type) {
    const ref = (type === 'hour') ? refScrollHour : refScrollMinute
    const index = (type === 'hour') ? scrollIndexHour : scrollIndexMinute
    const onChangeIndex = (type === 'hour') ? setScrollIndexHour : setScrollIndexMinute

    let newIndex = (index - COUNT_VISIBLE_ITEM < 0)
      ? 0
      : index - COUNT_VISIBLE_ITEM

    ref.current.scrollToIndex({ index: newIndex })
    onChangeIndex(newIndex)
  }

  function onActionDown (type) {
    const ref = (type === 'hour') ? refScrollHour : refScrollMinute
    const index = (type === 'hour') ? scrollIndexHour : scrollIndexMinute
    const onChangeIndex = (type === 'hour') ? setScrollIndexHour : setScrollIndexMinute
    const maxIndexItems = (type === 'hour') ? 18 : 54

    let newIndex = (index + COUNT_VISIBLE_ITEM > maxIndexItems)
      ? maxIndexItems
      : index + COUNT_VISIBLE_ITEM

    ref.current.scrollToIndex({ index: newIndex })
    onChangeIndex(newIndex)
  }

  function renderItem ({ item, index, type }) {
    const isActive = moment.tz(date, timezone)[type]() === item

    return pug`
      Div.cell(
        styleName={ cellActive: isActive }
        hoverStyleName='cellHover'
        onPress=()=> _onChangeDate({ item, type })
      )
        Span(styleName={ labelActive: isActive })
          = ('0' + item).slice(-2)
    `
  }

  const prepareHours = useMemo(() => new Array(24).fill(true).map((_, index) => index + 1), [])
  const prepareMinutes = useMemo(() => new Array(60).fill(true).map((_, index) => index + 1), [])

  return pug`
    Row.container
      Div.case
        Div.button(onPress=()=> onActionUp('hour'))
          Icon(icon=faChevronUp)
        FlatList.scroll(
          ref=refScrollHour
          data=prepareHours
          initialScrollIndex=parseInt(currentHour) - 1
          getItemLayout=(data, index)=>(
            { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
          )
          pagingEnabled=true
          showsHorizontalScrollIndicator=false
          renderItem=({ item, index })=> renderItem({ item, index, type: 'hour' })
        )
        Div.button(onPress=()=> onActionDown('hour'))
          Icon(icon=faChevronDown)

      Div.case
        Div.button(onPress=()=> onActionUp('minute'))
          Icon(icon=faChevronUp)
        FlatList.scroll(
          ref=refScrollMinute
          data=prepareMinutes
          initialScrollIndex=parseInt(currentMinute) - 1
          getItemLayout=(data, index)=>(
            { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
          )
          pagingEnabled=true
          scrollEnabled=false
          showsHorizontalScrollIndicator=false
          renderItem=({ item, index })=> renderItem({ item, index, type: 'minute' })
        )
        Div.button(onPress=()=> onActionDown('minute'))
          Icon(icon=faChevronDown)
  `
})
