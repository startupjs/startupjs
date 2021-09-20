import React, {
  useMemo,
  useRef,
  useCallback,
  useState,
  useLayoutEffect
} from 'react'
import { observer, useValue } from 'startupjs'
import { useMedia } from '@startupjs/ui'
import PropTypes from 'prop-types'
import moment from 'moment-timezone'
import 'moment/min/locales'
import Div from '../../Div'
import Divider from '../../Divider'
import TextInput from '../TextInput'
import AbstractPopover from '../../popups/Popover/AbstractPopover'
import Drawer from '../../popups/Drawer'
import { getLocale } from './helpers'
import { Calendar, TimeSelect } from './components'
import themed from '../../../theming/themed'
import './index.styl'

function DateTimePicker ({
  style,
  dateFormat,
  timeInterval,
  is24Hour,
  size,
  mode,
  renderCaption, // DEPRECATED replace InputComponent
  renderContent,
  locale,
  range,
  timezone,
  disabledDays = [],
  date,
  disabled,
  placeholder,
  maxDate,
  minDate,
  onChangeDate
}) {
  renderContent = renderContent || renderCaption

  const media = useMedia()
  const [visible, $visible] = useValue(false)
  const [textInput, setTextInput] = useState('')
  const refTimeSelect = useRef()
  const refInput = useRef()

  // remove seconds and milliseconds from timestamp
  useLayoutEffect(() => {
    _onChangeDate(+moment.tz(date, timezone).seconds(0).milliseconds(0))
  }, [])

  const exactLocale = useMemo(() => locale || getLocale() || 'en-US', [locale])

  const _dateFormat = useMemo(() => {
    if (dateFormat) return dateFormat
    if (mode === 'datetime') {
      return moment().locale(exactLocale)._locale._longDateFormat.L + ' ' +
      moment().locale(exactLocale)._locale._longDateFormat.LT
    }

    if (mode === 'date') return moment().locale(exactLocale)._locale._longDateFormat.L
    if (mode === 'time') return moment().locale(exactLocale)._locale._longDateFormat.LT
  }, [dateFormat, timezone])

  function getFormatDate (value) {
    return moment.tz(value, timezone).format(_dateFormat)
  }

  function _onChangeDate (value) {
    // check interval
    const interval = (timeInterval * 60 * 1000)

    const bottom = value - (value % interval)
    const top = bottom + interval
    value = top > bottom ? bottom : top

    // check min, max
    if (minDate != null && value < minDate) {
      value = minDate
    }

    if (maxDate != null && value > maxDate) {
      value = maxDate
    }

    setTextInput(getFormatDate(value))
    onChangeDate && onChangeDate(value)
  }

  const onDismiss = useCallback(() => {
    $visible.set(false)
    refInput.current.blur()
  }, [textInput])

  function onChangeText (text) {
    const momentInstance = moment.tz(text, _dateFormat, true, timezone)
    if (momentInstance.isValid()) {
      _onChangeDate(+momentInstance)
      refTimeSelect.current && refTimeSelect.current.scrollToIndex(+momentInstance)
    } else setTextInput(text)
  }

  const inputProps = {
    style,
    ref: refInput,
    disabled,
    size,
    placeholder,
    value: visible ? textInput : getFormatDate(date),
    onChangeText
  }

  const caption = pug`
    if renderContent
      = renderContent(Object.assign({ $visible }, inputProps))
    else
      TextInput(
        ...inputProps
        onFocus=()=> $visible.set(true)
      )
  `

  function renderPopoverContent () {
    return pug`
      Div.content
        if (mode === 'date') || (mode === 'datetime')
          Calendar(
            date=date
            exactLocale=exactLocale
            disabledDays=disabledDays
            locale=locale
            maxDate=maxDate
            minDate=minDate
            range=range
            timezone=timezone
            onChangeDate=_onChangeDate
          )

        if mode === 'datetime'
          Divider.divider

        if (mode === 'time') || (mode === 'datetime')
          TimeSelect(
            date=date
            ref=refTimeSelect
            maxDate=maxDate
            minDate=minDate
            timezone=timezone
            exactLocale=exactLocale
            is24Hour=is24Hour
            timeInterval=timeInterval
            onChangeDate=_onChangeDate
          )
    `
  }

  function renderWrapper (children) {
    return pug`
      Div.popoverWrapper
        Div.popoverOverlay(feedback=false onPress=()=> $visible.set(false))
        = children
    `
  }

  return pug`
    if media.tablet
      = caption
      AbstractPopover.popover(
        visible=visible
        refAnchor=refInput
        renderWrapper=renderWrapper
        onRequestClose=onDismiss
      )= renderPopoverContent()
    else
      = caption
      Drawer.drawer(
        visible=visible
        position='bottom'
        swipeStyleName='swipe'
        onDismiss=onDismiss
      )= renderPopoverContent()
  `
}

DateTimePicker.defaultProps = {
  mode: 'datetime',
  size: 'm',
  timeInterval: 5,
  timezone: moment.tz.guess()
}

DateTimePicker.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  timeInterval: PropTypes.number,
  is24Hour: PropTypes.bool,
  date: PropTypes.number,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  maxDate: PropTypes.number,
  minDate: PropTypes.number,
  mode: PropTypes.oneOf(['date', 'time', 'datetime']),
  renderCaption: PropTypes.func,
  range: PropTypes.array,
  locale: PropTypes.string,
  timezone: PropTypes.string,
  disabledDays: PropTypes.array,
  dateFormat: PropTypes.string,
  size: PropTypes.oneOf(['l', 'm', 's']),
  onChangeDate: PropTypes.func
}

export default observer(
  themed('DateTimePicker', DateTimePicker),
  { forwardRef: true }
)
