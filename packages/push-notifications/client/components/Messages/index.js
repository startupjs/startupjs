import React, { useState } from 'react'
import { observer, useQuery, useValue } from 'startupjs'
import {
  Span,
  Row,
  Div,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  Pagination
} from '@startupjs/ui'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import _get from 'lodash/get'
import SendMessageForm from '../SendMessageForm'
import './index.styl'

const LIMIT = 10

function Messages () {
  const [skip, setSkip] = useState(0)
  const [, $visible] = useValue(false)
  const [pushMessages = []] = useQuery('pushMessages', {
    $limit: LIMIT,
    $skip: skip
  })

  const [pushMessagesCount = 0] = useQuery('pushMessages', { $count: true })

  return pug`
    Div.root
      Row.menu
        Button(
          icon=faPlus
          variant='flat'
          color='primary'
          onPress=() => $visible.set(true)
        ) New Notification
      Table.table
        Thead
          Tr
            Th
              Span Created At
            Th
              Span Title
            Th
              Span Body
            Th
              Span Platforms
        if pushMessages.length
          Tbody
            each pushMessage in pushMessages
              Tr(key=pushMessage.id)
                Td
                  Span= new Date(pushMessage.createdAt).toLocaleDateString()
                Td
                  Span= pushMessage.options.title ? pushMessage.options.title : '✗'
                Td
                  Span= pushMessage.options.body
                Td
                  Span= _get(pushMessage, 'options.filters.platforms', ['ios', 'android']).join(', ')
    unless pushMessagesCount < LIMIT
      Row(align='center')
        Pagination(
          count=pushMessagesCount
          limit=LIMIT
          skip=skip
          onChangePage=val => setSkip(val * LIMIT)
        )
    Modal($visible=$visible)
      SendMessageForm(onClose=() => $visible.set(false))
  `
}

export default observer(Messages)
