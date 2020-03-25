import React, { useMemo } from 'react'
import { View } from 'react-native'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import Div from '../Div'
import Span from '../Span'
import Icon from '../Icon'
import {
  faArrowLeft,
  faArrowRight,
  faAngleDoubleLeft,
  faAngleDoubleRight
} from '@fortawesome/free-solid-svg-icons'
import config from '../../config/rootConfig'
import './index.styl'

import usePagination from './usePagination'

const { colors } = config

function Pagination ({
  style,
  boundaryCount,
  variant,
  disabled,
  siblingCount,
  hideNextButton,
  hidePrevButton,
  showFirstButton,
  showLastButton,
  value,
  count,
  onChange,
  ...props
}) {
  const items = usePagination({
    boundaryCount,
    count,
    disabled,
    page: value,
    siblingCount,
    hideNextButton,
    hidePrevButton,
    showFirstButton,
    showLastButton,
    onChange
  })

  const isFloating = variant === 'floating'

  return pug`
    View.root(
      style=style
      styleName=[variant]
    )
      each item, index in items
        - const isActive = item.page === value
        PaginationButton(
          key=index
          bold=isFloating
          disabled=disabled || item.disabled
          variant=variant
          active=isActive
          label=item.page
          type=item.type
          onPress=() => item.page && onChange(item.page)
        )
  `
}

Pagination.defaultProps = {
  boundaryCount: 1,
  variant: 'filled',
  count: 0,
  value: 1,
  siblingCount: 1,
  hideNextButton: false,
  hidePrevButton: false,
  showFirstButton: false,
  showLastButton: false
}

Pagination.propTypes = {
  style: propTypes.object,
  boundaryCount: propTypes.number,
  variant: propTypes.oneOf(['filled', 'floating']),
  count: propTypes.number.isRequired,
  value: propTypes.number.isRequired,
  siblingCount: propTypes.number,
  hideNextButton: propTypes.bool,
  hidePrevButton: propTypes.bool,
  showFirstButton: propTypes.bool,
  showLastButton: propTypes.bool,
  disabled: propTypes.bool,
  onChange: propTypes.func.isRequired
}

const CONTROLS_MAP = {
  previous: { label: 'Prev', icon: faArrowLeft },
  next: { label: 'Next', icon: faArrowRight },
  first: { label: null, icon: faAngleDoubleLeft },
  last: { label: null, icon: faAngleDoubleRight },
  'start-ellipsis': { label: '...', icon: null },
  'end-ellipsis': { label: '...', icon: null }
}

function PaginationButton ({
  style,
  active,
  bold,
  disabled,
  label,
  variant,
  type,
  onPress
}) {
  const isControls = useMemo(() => !!CONTROLS_MAP[type], [type])

  const extraProps = useMemo(() => {
    let _extraProps = {}
    if (onPress && !active) _extraProps.onPress = onPress
    if (isControls && variant === 'floating') _extraProps.level = 1
    return _extraProps
  }, [onPress, active, variant, isControls])

  const _label = useMemo(() => {
    let _label

    switch (variant) {
      case 'filled':
        _label = isControls ? CONTROLS_MAP[type].label : label
        break
      case 'floating':
        _label = label
        if (isControls) {
          if (CONTROLS_MAP[type].icon) {
            _label = null
          } else {
            _label = CONTROLS_MAP[type].label
          }
        }
    }

    return _label
  }, [isControls, type, variant, label])

  const _icon = useMemo(() => {
    let _icon

    switch (variant) {
      case 'filled':
        _icon = isControls && !CONTROLS_MAP[type].label ? CONTROLS_MAP[type].icon : null
        break
      case 'floating':
        _icon = isControls ? CONTROLS_MAP[type].icon : null
    }

    return _icon
  }, [variant, isControls, type])

  return pug`
    Div.button(
      style=style
      styleName=[variant, type, { disabled, active: !isControls && active }]
      disabled=disabled
      ...extraProps
    )
      if _icon
        Icon(
          icon=_icon
          color= disabled ? colors.darkLighter : colors.dark
        )
      if _label
        Span.label(
          bold=bold || isControls
          description=disabled
          styleName=[variant, { active }]
        )= _label
  `
}

export default observer(Pagination)
