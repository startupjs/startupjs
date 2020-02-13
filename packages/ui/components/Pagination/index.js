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
  disabled,
  visibleCount,
  showLast,
  showFirst,
  value,
  variant,
  total,
  limit,
  onChange
}) {
  const isFilled = variant === 'filled'
  const activePage = value + 1
  // If no limit provided we assume there is only one item per page
  const pagesCount = Math.ceil(total / (limit || 1))

  const [
    backButtonExtraProps,
    nextButtonExtraProps
  ] = useMemo(() => {
    let computedControllsProps = {}
    let backButtonExtraProps = {}
    let nextButtonExtraProps = {}

    switch (variant) {
      case 'filled':
        computedControllsProps.variant = 'flat'
        computedControllsProps.color = colors.darkLightest
        computedControllsProps.shape = 'squared'
        computedControllsProps.textColor = colors.dark
        break
      case 'floating':
        computedControllsProps.variant = 'shadowed'
        computedControllsProps.shape = 'circle'
        computedControllsProps.iconsColor = colors.dark
        backButtonExtraProps.icon = faArrowLeft
        nextButtonExtraProps.icon = faArrowRight
    }
    return [
      { ...computedControllsProps, ...backButtonExtraProps },
      { ...computedControllsProps, ...nextButtonExtraProps }
    ]
  }, [variant])

  const centerPageCeil = Math.ceil(visibleCount / 2)
  const isMoreThanCenter = activePage + centerPageCeil > pagesCount
  const isLessThanCenter = activePage - visibleCount < 0
  const centerPageFloor = Math.floor(visibleCount / 2)

  const from = isLessThanCenter
    ? 0
    : isMoreThanCenter
      ? pagesCount - visibleCount
      : activePage - centerPageCeil

  const to = pagesCount < visibleCount
    ? pagesCount
    : isLessThanCenter
      ? visibleCount
      : activePage + centerPageFloor > pagesCount
        ? pagesCount
        : centerPageFloor + activePage

  const items = useMemo(() => Array(to - from).fill(null), [to, from])

  return pug`
    Div.root(
      styleName=[variant]
    )
      - const prevValue = value - 1
      - const nextValue = value + 1
      - const lastValue = pagesCount - 1
      - const isFirstPageSelected = value <= 0
      - const isLastPageSelected = activePage >= pagesCount
      Button.back(
        disabled=isFirstPageSelected || disabled
        onPress=() => onChange(prevValue)
        ...backButtonExtraProps
      )
        = isFilled ? 'Back' : null
      if from && showFirst
        PaginationButton(
          disabled=disabled
          bold=!isFilled
          variant=variant
          label=1
          onPress=() => onChange(0)
        )
        View.dots
          Span ...
      each item, index in items
        - const _value = from + index
        - const label = _value + 1
        - const isActive = _value === value
        PaginationButton(
          disabled=disabled
          bold=!isFilled
          variant=variant
          key=index
          active=isActive
          label=label
          onPress=() => onChange(_value)
        )
      if to <= lastValue && showLast
        View.dots
          Span ...
        PaginationButton(
          disabled=disabled
          bold=!isFilled
          variant=variant
          label=pagesCount
          onPress=() => onChange(lastValue)
        )
      Button.next(
        disabled=isLastPageSelected || disabled
        onPress=() => onChange(nextValue)
        ...nextButtonExtraProps
      )
        = isFilled ? 'Next' : null
  `
}

Pagination.defaultProps = {
  visibleCount: 5,
  total: 0,
  limit: 0,
  value: 0,
  variant: 'filled',
  showLast: true,
  showFirst: true
}

Pagination.propTypes = {
  disabled: propTypes.bool,
  visibleCount: propTypes.number,
  showLast: propTypes.bool,
  showFirst: propTypes.bool,
  total: propTypes.number,
  value: propTypes.number.isRequired,
  variant: propTypes.oneOf(['filled', 'floating']),
  limit: propTypes.number,
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
