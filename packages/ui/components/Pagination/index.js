import React from 'react'
import usePagination from './usePagination'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import Span from './../typography/Span'
import Row from './../Row'
import Div from './../Div'
import Icon from './../Icon'
import {
  faAngleLeft,
  faAngleDoubleLeft,
  faAngleRight,
  faAngleDoubleRight
} from '@fortawesome/free-solid-svg-icons'
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
    Row
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
            Row.status(vAlign='center')
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
  style: propTypes.object,
  variant: propTypes.oneOf(['full', 'compact']),
  page: propTypes.number,
  pages: propTypes.number,
  skip: propTypes.number,
  limit: propTypes.number,
  count: propTypes.number,
  boundaryCount: propTypes.number,
  siblingCount: propTypes.number,
  showFirstButton: propTypes.bool,
  showLastButton: propTypes.bool,
  showPrevButton: propTypes.bool,
  showNextButton: propTypes.bool,
  disabled: propTypes.bool,
  onChangePage: propTypes.func
  // onChangeLimit: propTypes.func TODO: Add selectbox to component to change limit
}

export default observer(Pagination)
