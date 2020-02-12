import React, { useMemo } from 'react'
import { View } from 'react-native'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import Div from '../Div'
import Span from '../Span'
import Button from '../Button'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import config from '../../config/rootConfig'
import './index.styl'

const { colors } = config

function Pagination ({
  buttonsCount,
  showLastPage,
  showFirstPage,
  value,
  variant,
  total,
  limit,
  onChange
}) {
  const page = value + 1
  const pagesCount = Math.ceil(total / limit)

  const [
    wrapperExtraProps,
    backButtonExtraProps,
    nextButtonExtraProps
  ] = useMemo(() => {
    let wrapperExtraProps = {}
    let computedControllsProps = {}
    let backButtonExtraProps = {}
    let nextButtonExtraProps = {}

    switch (variant) {
      case 'connected':
        wrapperExtraProps.level = 1
        computedControllsProps.variant = 'flat'
        computedControllsProps.color = colors.darkLightest
        computedControllsProps.shape = 'squared'
        computedControllsProps.textColor = colors.dark
        break
      case 'floating':
        computedControllsProps.variant = 'shadowed'
        computedControllsProps.color = colors.white
        computedControllsProps.shape = 'circle'
        computedControllsProps.iconsColor = colors.dark
        backButtonExtraProps.icon = faArrowLeft
        nextButtonExtraProps.icon = faArrowRight
    }
    return [
      wrapperExtraProps,
      { ...computedControllsProps, ...backButtonExtraProps },
      { ...computedControllsProps, ...nextButtonExtraProps }
    ]
  }, [variant])

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
    Div.root(...wrapperExtraProps)
      - const isFirstPageSelected = value <= 0
      - const isLastPageSelected = page >= pagesCount
      Button.back(
        disabled=isFirstPageSelected
        onPress=() => onChange(value - 1)
        ...backButtonExtraProps
      )
        = variant === 'connected' ? 'Back' : null
      if from && showFirstPage
        PaginationButton(
          variant=variant
          label=1
          onPress=() => onChange(0)
        )
        View.dots
          Span ...
      each item, index in Array(to - from).fill(from)
        - const page = from + index + 1
        - const isActive = page === value + 1
        PaginationButton(
          variant=variant
          key=index
          active=isActive
          label=page
          onPress=() => onChange(page - 1)
        )
      if to < pagesCount && showLastPage
        View.dots
          Span ...
        PaginationButton(
          variant=variant
          label=pagesCount
          disabled=value >= pagesCount
          onPress=() => onChange(pagesCount - 1)
        )
      Button.next(
        disabled=isLastPageSelected
        onPress=() => onChange(value + 1)
        ...nextButtonExtraProps
      )
        = variant === 'connected' ? 'Next' : null
  `
}

Pagination.defaultProps = {
  buttonsCount: 5,
  total: 0,
  limit: 0,
  value: 0,
  variant: 'connected',
  showLastPage: false,
  showFirstPage: false
}

Pagination.propTypes = {
  buttonsCount: propTypes.number,
  showLastPage: propTypes.bool,
  showFirstPage: propTypes.bool,
  total: propTypes.number.isRequired,
  value: propTypes.number.isRequired,
  variant: propTypes.oneOf(['connected', 'floating']),
  limit: propTypes.number.isRequired,
  onChange: propTypes.func.isRequired
}

function PaginationButton ({
  style,
  active,
  bold,
  disabled,
  label,
  variant,
  onPress
}) {
  const extraProps = {}
  if (!active) extraProps.onPress = onPress
  return pug`
    Div.button(
      style=style
      styleName=[variant, { disabled, active }]
      disabled=disabled
      ...extraProps
    )
      Span.label(bold=bold styleName=[variant, { active }])= label
  `
}

export default observer(Pagination)
