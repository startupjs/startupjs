import React from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import Div from '../Div'
import Span from '../Span'
import Button from '../Button'
import config from '../../config/rootConfig'
import { faLongArrowAltLeft, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons'
import './index.styl'

const { colors } = config

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
      - const isFirstPageSelected = value <= 0
      - const isLastPageSelected = page >= pagesCount
      Button.back(
        styleName={disabled: isFirstPageSelected}
        size='s'
        shape='squared'
        variant='ghost'
        icon=faLongArrowAltLeft
        iconColor=colors.dark
        disabled=isFirstPageSelected
        onPress=() => onChange(value - 1)
        textColor=colors.dark
      )
        = 'Back'
      if from && showFirstPage
        PaginationButton(
          label=1
          onPress=() => onChange(0)
        )
        Div(style={justifyContent: 'center'})
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
        Div(style={justifyContent: 'center'})
          Span ...
        PaginationButton(
          label=pagesCount
          disabled=value >= pagesCount
          onPress=() => onChange(pagesCount - 1)
        )
      Button.next(
        size='s'
        styleName={ disabled: isLastPageSelected }
        shape='squared'
        variant='ghost'
        rightIcon=faLongArrowAltRight
        rightIconColor=colors.dark
        disabled=isLastPageSelected
        onPress=() => onChange(value + 1)
        textColor=colors.dark
      )
        = 'Next'
  `
}

Pagination.defaultProps = {
  buttonsCount: 5,
  total: 0,
  limit: 0,
  value: 0,
  showLastPage: false,
  showFirstPage: false
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
  const extraProps = {}
  if (!active) extraProps.onPress = onPress
  return pug`
    Div.button(
      style=style
      styleName={ disabled, active }
      disabled=disabled
      ...extraProps
    )
      Span.label(bold=bold styleName={ active })= label
  `
}

export default observer(Pagination)
