import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import Div from '../Div'
import Span from '../Span'
import './index.styl'

function Pagination ({
  count,
  value,
  total,
  limit,
  onChange
}) {
  const pagesCount = Math.ceil(total / limit)
  const from = value - (count + 1) < 0
    ? 0 : value - (count + 1)
  const to = (value + count) * limit > total
    ? pagesCount : value + count

  return pug`
    Div.root(level=1)
      PaginationButton.back(
        styleName={ disabled: value <= 1 }
        bold
        label='back'
        disabled=value <= 1
        onPress=() => onChange(value - 1)
      )
      if from
        PaginationButton(
          label=1
          onPress=() => onChange(1)
        )
        Div(style={justifyContent: 'flex-end'})
          Span ...
      each item, index in Array(to - from).fill(from)
        - const page = from + index + 1
        PaginationButton(
          key=index
          active=page === value
          label=page
          onPress=() => onChange(page)
        )
      if to < pagesCount
        Div(style={justifyContent: 'flex-end'})
          Span ...
        PaginationButton(
          label=pagesCount
          disabled=value >= pagesCount
          onPress=() => onChange(pagesCount)
        )
      PaginationButton.next(
        styleName={ disabled: value >= pagesCount }
        bold
        label='next'
        disabled=value >= pagesCount
        onPress=() => onChange(value + 1)
      )
  `
}

Pagination.defaultProps = {
  count: 2,
  total: 1800,
  limit: 10,

  // TODO. remove
  onChange: (page) => console.log(page)
}

Pagination.propTypes = {
  count: propTypes.number,
  value: propTypes.number,
  limit: propTypes.number,
  onChange: propTypes.func.isRequired
}

function PaginationButton ({
  style,
  active,
  bold,
  disabled,
  label,
  onPress
}) {
  return pug`
    TouchableOpacity.button(
      style=style
      styleName={ disabled, active }
      disabled=disabled
      onPress=onPress
    )
      Span.label(bold=bold styleName={ active })= label
  `
}

export default observer(function Test () {
  const [page, setPage] = useState(1)
  return pug`
    Span= page
    Pagination(
      value=page
      onChange=(page) => setPage(page)
    )
  `
})
