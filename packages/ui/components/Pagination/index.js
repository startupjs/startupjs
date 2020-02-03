import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import Div from '../Div'
import Span from '../Span'
import './index.styl'

function Pagination ({
  buttonsCount,
  showLastPage,
  showFirstPage,
  value,
  total,
  limit,
  onChange
}) {
  const page = value + 1
  const pagesCount = Math.ceil(total / limit)

  const from = page - buttonsCount < 0
    ? 0
    : page + Math.ceil(buttonsCount / 2) > pagesCount
      ? pagesCount - buttonsCount
      : page - Math.ceil(buttonsCount / 2)

  const to = pagesCount < buttonsCount
    ? pagesCount
    : page - buttonsCount < 0
      ? buttonsCount
      : page + Math.floor(buttonsCount / 2) > pagesCount
        ? pagesCount
        : Math.floor(buttonsCount / 2) + page

  return pug`
    Div.root(level=1)
      PaginationButton.back(
        styleName={ disabled: value <= 1 }
        bold
        label='back'
        disabled=page <= 1
        onPress=() => onChange(value - 1)
      )
      if from && showFirstPage
        PaginationButton(
          label=1
          onPress=() => onChange(1)
        )
        Div(style={justifyContent: 'flex-end'})
          Span ...
      each item, index in Array(to - from).fill(from)
        - const page = from + index + 1
        - const isActive = page === value + 1
        PaginationButton(
          key=index
          active=isActive
          label=page
          onPress=() => onChange(page - 1)
        )
      if to < pagesCount && showLastPage
        Div(style={justifyContent: 'flex-end'})
          Span ...
        PaginationButton(
          label=pagesCount
          disabled=value >= pagesCount
          onPress=() => onChange(pagesCount - 1)
        )
      PaginationButton.next(
        styleName={ disabled: value >= pagesCount }
        bold
        label='next'
        disabled=page >= pagesCount
        onPress=() => onChange(value + 1)
      )
  `
}

Pagination.defaultProps = {
  buttonsCount: 5,
  total: 400,
  limit: 10,
  value: 1,
  showLastPage: false,
  showFirstPage: false,

  // TODO. remove
  onChange: (page) => console.log(page)
}

Pagination.propTypes = {
  buttonsCount: propTypes.number,
  showLastPage: propTypes.bool,
  showFirstPage: propTypes.bool,
  total: propTypes.number.isRequired,
  value: propTypes.number.isRequired,
  limit: propTypes.number.isRequired,
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
  const [page, setPage] = useState(0)
  return pug`
    Span= page
    Pagination(
      value=page
      onChange=(page) => setPage(page)
    )
  `
})
