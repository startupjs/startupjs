import React, { useState } from 'react'
import { observer, useQuery } from 'startupjs'
import {
  Row,
  Div,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Pagination
} from '@startupjs/ui'
import _get from 'lodash/get'
import './index.styl'

const LIMIT = 10

function Messages () {
  const [skip, setSkip] = useState(0)
  const [pushMessages] = useQuery('pushMessages', {
    $limit: LIMIT,
    $skip: skip
  })

  const [pushMessagesCount] = useQuery('pushMessages', { $count: true })

  return pug`
    Div.root
      Table.table
        Thead
          Tr
            Th Created At
            Th Title
            Th Body
            Th Platforms
        Tbody
          each pushMessage in pushMessages
            Tr(key=pushMessage.id)
              Td= new Date(pushMessage.createdAt).toLocaleDateString()
              Td= pushMessage.title || '✗'
              Td= pushMessage.body
              Td= _get(pushMessage, 'platforms', ['ios', 'android']).join(', ')
    Row.pagination(align='center')
      Pagination(
        count=pushMessagesCount
        limit=LIMIT
        skip=skip
        onChangePage=val => setSkip(val * LIMIT)
      )
  `
}

export default observer(Messages)
