import React from 'react'
import { pug, observer } from 'startupjs'
import PropTypes from 'prop-types'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons/faAngleLeft'
import { faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons/faAngleDoubleLeft'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons/faAngleRight'
import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons/faAngleDoubleRight'
import usePagination from './usePagination'
import Span from './../typography/Span'
import Div from './../Div'
import Icon from './../Icon'
import themed from '../../theming/themed'
import './index.styl'

const ICONS = {
  first: faAngleDoubleLeft,
  last: faAngleDoubleRight,
  previous: faAngleLeft,
  next: faAngleRight
}

function Pagination (props) {
  const items = usePagination(props)

  return pug`
    Div(row)
      each item, index in items
        React.Fragment(key=index)
          - const { type, value, selected, disabled, ...itemProps } = item
          if type === 'page'
            Div.item(
              variant='highlight'
              shape='circle'
              disabled=disabled
              ...itemProps
            )
              Span.page(styleName={ selected })= item.value + 1
          else if ['first', 'last', 'previous', 'next'].includes(type)
            Div.item(
              variant='highlight'
              shape='circle'
              disabled=disabled
              ...itemProps
            )
              Icon.icon(
                styleName={disabled}
                icon=ICONS[type]
              )
          else if ~type.indexOf('ellipsis')
            Div.item
              Span ...
          else if type === 'status'
            Div.status(vAlign='center' row)
              Span= item.value
    `
}

Pagination.defaultProps = {
  variant: 'full',
  boundaryCount: 1, // min 1
  siblingCount: 1, // min 0
  // Skip, limit, count are necessary for the sandbox
  skip: 0,
  limit: 1,
  count: 0,
  showFirstButton: false,
  showLastButton: false,
  showPrevButton: true,
  showNextButton: true,
  disabled: false
}

Pagination.propTypes = {
  style: PropTypes.object,
  variant: PropTypes.oneOf(['full', 'compact']),
  page: PropTypes.number,
  pages: PropTypes.number,
  skip: PropTypes.number,
  limit: PropTypes.number,
  count: PropTypes.number,
  boundaryCount: PropTypes.number,
  siblingCount: PropTypes.number,
  showFirstButton: PropTypes.bool,
  showLastButton: PropTypes.bool,
  showPrevButton: PropTypes.bool,
  showNextButton: PropTypes.bool,
  disabled: PropTypes.bool,
  onChangePage: PropTypes.func
  // onChangeLimit: propTypes.func TODO: Add selectbox to component to change limit
}

export default observer(themed('Pagination', Pagination))
