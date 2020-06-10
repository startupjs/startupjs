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
              Span.page(styleName={ selected })= item.value
          else if ['first', 'last', 'previous', 'next'].includes(type)
            Div.item(
              variant='highlight'
              shape='circle'
              disabled=disabled
              ...itemProps
            )
              Icon(icon=ICONS[type] color=disabled ? 'darkLight' : 'dark')
          else if ~type.indexOf('ellipsis')
            Div.item
              Span ...
          else if type === 'status'
            Row.status(vAlign='center')
              Span
                = props.page
                | &nbsp;of&nbsp;
                = props.count
    `
}

Pagination.defaultProps = {
  variant: 'full',
  page: 1,
  boundaryCount: 1,
  count: 1,
  siblingCount: 1,
  showFirstButton: true,
  showLastButton: true,
  hidePrevButton: false,
  hideNextButton: false,
  disabled: false
}

Pagination.propTypes = {
  style: propTypes.object,
  variant: propTypes.oneOf(['full', 'compact']),
  page: propTypes.number,
  boundaryCount: propTypes.number,
  count: propTypes.number,
  siblingCount: propTypes.number,
  showFirstButton: propTypes.bool,
  showLastButton: propTypes.bool,
  hidePrevButton: propTypes.bool,
  hideNextButton: propTypes.bool,
  disabled: propTypes.bool,
  onChange: propTypes.func
}

export default observer(Pagination)
