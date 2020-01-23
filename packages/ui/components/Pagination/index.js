import React, { useState } from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import Div from '../Div'
import Span from '../Span'
import './index.styl'

function Pagination ({
  count,
  currentPage,
  total,
  limit,
  onPageChange
}) {
  const pagesCount = Math.ceil(total / limit)
  const from = currentPage - count < 0
    ? 0 : currentPage - count
  const to = (currentPage + count) * limit > total
    ? pagesCount : currentPage + count

  return pug`
    Div.root
      Button(
        label='back'
        onPress=() => onPageChange(currentPage - 1)
        disabled=currentPage <= 1
      )
      if from
        Button(
          label=1
          onPress=() => onPageChange(1)
        )
        Span ...
      each item, index in Array(to - from).fill(from)
        - const page = from + index + 1
        Button(key=index label=page onPress=() => onPageChange(page))
      if to < pagesCount
        Span ...
        Button(
          label=pagesCount
          onPress=() => onPageChange(pagesCount)
          disabled=currentPage >= pagesCount
        )
      Button(
        label='next'
        onPress=() => onPageChange(currentPage + 1)
        disabled=currentPage >= pagesCount
      )
  `
}

Pagination.defaultProps = {
  currentPage: 1,
  count: 1,
  total: 1800,
  limit: 1,

  // TODO. remove
  onPageChange: (page) => console.log(page)
}

Pagination.propTypes = {
  count: propTypes.number,
  currentPage: propTypes.number,
  limit: propTypes.number,
  onPageChange: propTypes.func.isRequired
}

// export default observer(Pagination)

// TODO. Replace with ui button when its merged
function Button ({ onPress, label, disabled }) {
  console.log(disabled)
  return pug`
    TouchableOpacity(
      style={
        height: 32,
        border: '1px solid rgba(0,0,0, .5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 8,
        paddingRight: 8,
        minWidth: 32
      }
      disabled=disabled
      onPress=onPress
    )
      Text= label
  `
}

export default observer(function Test () {
  const [page, setPage] = useState(1)
  return pug`
    Span= page
    Pagination(
      count=2
      currentPage=page
      total=1800
      limit=11
      onPageChange=(page) => setPage(page)
    )
  `
})
