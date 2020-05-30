import React, { useMemo } from 'react'
import { View } from 'react-native'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import Div from '../Div'
import Span from '../typography/Span'
import Button from '../Button'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import config from '../../config/rootConfig'
import './index.styl'

const { colors } = config

function Pagination ({
  style,
  variant,
  disabled,
  visibleCount,
  showLast,
  showFirst,
  value,
  total,
  onChange
}) {
  // numeration value for starting `value` prop count from 0
  const numerationValue = value + 1
  const isFilled = variant === 'filled'
  const isFirstPageSelected = numerationValue <= 1
  const isLastPageSelected = numerationValue >= total

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

  const halfVisibleCount = Math.floor(visibleCount / 2)
  const firstVisibleButton = numerationValue + halfVisibleCount >= total
    ? (total - visibleCount) + 1
    : numerationValue - halfVisibleCount
  const firstButton = firstVisibleButton < 1
    ? 1
    : firstVisibleButton

  const lastVisibleButton = numerationValue + halfVisibleCount
  const lastButton = lastVisibleButton < visibleCount
    ? visibleCount
    : lastVisibleButton

  const from = firstButton
  const to = lastButton >= total ? total : lastButton

  const items = useMemo(() => Array((to - from) + 1).fill(null), [to, from])

  return pug`
    View.root(
      style=style
      styleName=[variant]
    )
      Button.back(
        disabled=isFirstPageSelected || disabled
        onPress=() => onChange(value - 1)
        ...backButtonExtraProps
      )
        = isFilled ? 'Back' : null
      if showFirst && from > 1
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
        - const isActive = _value === numerationValue
        PaginationButton(
          key=index
          disabled=disabled
          bold=!isFilled
          variant=variant
          active=isActive
          label=_value
          onPress=() => onChange(_value - 1)
        )
      if showLast && to < total
        View.dots
          Span ...
        PaginationButton(
          disabled=disabled
          bold=!isFilled
          variant=variant
          label=total
          onPress=() => onChange(total - 1)
        )
      Button.next(
        disabled=isLastPageSelected || disabled
        onPress=() => onChange(value + 1)
        ...nextButtonExtraProps
      )
        = isFilled ? 'Next' : null
  `
}

Pagination.defaultProps = {
  variant: 'filled',
  visibleCount: 3,
  total: 1,
  value: 0,
  showLast: true,
  showFirst: true
}

Pagination.propTypes = {
  style: propTypes.object,
  variant: propTypes.oneOf(['filled', 'floating']),
  visibleCount: propTypes.number,
  total: propTypes.number.isRequired,
  value: propTypes.number.isRequired,
  showLast: propTypes.bool,
  showFirst: propTypes.bool,
  disabled: propTypes.bool,
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
