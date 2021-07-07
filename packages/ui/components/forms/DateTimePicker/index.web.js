/* @jsx unstable_createElement */
import React, { useMemo, useState } from 'react'
// eslint-disable-next-line
import { unstable_createElement } from 'react-native-web'
import DatePicker, { CalendarContainer, registerLocale } from 'react-datepicker'
import { observer } from 'startupjs'
import moment from 'moment-timezone'
import PropTypes from 'prop-types'
import * as locale from 'date-fns/locale'
import Div from '../../Div'
import Span from './../../typography/Span'
import themed from '../../../theming/themed'
import { useLayout } from './../../../hooks'
import './index.styl'

const localLanguage = window.navigator.language
const DEFAULT_LOCALE = 'enUS'
const languageArray = localLanguage.split('-')
const preparedLocale = `${languageArray[0]}${(languageArray[1] || '').toUpperCase()}`

registerLocale('currentLocale', locale[preparedLocale] || locale[DEFAULT_LOCALE])

const scrollableClasses = [
  'react-datepicker__time-list',
  'react-datepicker__month-select',
  'react-datepicker__year-select'
]

function DateTimePicker ({
  style,
  InputComponent,
  date,
  disabled,
  format,
  label,
  description,
  layout,
  maxDate,
  minDate,
  minuteInterval,
  mode,
  placeholder,
  size,
  timeFormat,
  onDateChange
}) {
  layout = useLayout({ layout, label, description })

  const pure = layout === 'pure'
  const [focused, setFocused] = useState(false)

  // DatePicker doesn't accept "DD" or "D" day format
  const _format = format && format.replace(/D/g, 'd')

  const pickerProps = {
    showTimeSelect: mode !== 'date',
    showTimeSelectOnly: mode === 'time',
    dateFormat: _format || 'Pp'
  }

  const maxDateDefault = useMemo(() => {
    return maxDate || moment().add(100, 'year').valueOf()
  }, [maxDate])

  if (mode === 'time') pickerProps.dateFormat = _format || 'p'
  if (mode === 'date') pickerProps.dateFormat = _format || 'P'
  if (mode !== 'date') pickerProps.timeFormat = timeFormat || 'p'
  if (minDate) pickerProps.minDate = minDate
  if (InputComponent) pickerProps.customInput = InputComponent

  const renderCalendarContainer = ({ children }) => {
    return (
      <Div level={2} styleName='container'>
        <CalendarContainer className={mode}>
          {children}
        </CalendarContainer>
      </Div>

    )
  }

  function renderContainer (children) {
    if (pure) {
      return pug`
        Div(style=style)= children
      `
    } else {
      return pug`
        Div(style=style)
          if label
            Span.label(styleName={focused})= label
          = children
          if description
            Span.description(description)= description
      `
    }
  }

  return renderContainer(pug`
    DatePicker(
      className=size
      calendarClassName=mode
      calendarContainer=renderCalendarContainer
      disabled=disabled
      dropdownMode='select'
      fixedHeight
      locale='currentLocale'
      maxDate=maxDateDefault
      placeholderText=placeholder
      portalId='datepicker-portal'
      selected=date
      showMonthDropdown
      showMonthYearSelect
      showPopperArrow=false
      showYearDropdown
      timeIntervals=minuteInterval
      closeOnScroll= e => !scrollableClasses.includes(e.target.className)
      onChange= date => onDateChange(+date)
      onCalendarClose= () => setFocused(false)
      onCalendarOpen= () => setFocused(true)
      ...pickerProps
    )
  `)
}

DateTimePicker.defaultProps = {
  minuteInterval: 1,
  mode: 'datetime',
  size: 'm',
  onDateChange: () => {}
}

DateTimePicker.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  InputComponent: PropTypes.node,
  date: PropTypes.number,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  description: PropTypes.string,
  layout: PropTypes.oneOf(['pure', 'rows']),
  maxDate: PropTypes.number,
  minDate: PropTypes.number,
  minuteInterval: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30]),
  mode: PropTypes.oneOf(['date', 'time', 'datetime']),
  size: PropTypes.oneOf(['l', 'm', 's']),
  onDateChange: PropTypes.func
}

export default observer(themed(DateTimePicker))
