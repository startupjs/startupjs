import React, { useState } from 'react'
import { observer, useQuery, useValue } from 'startupjs'
import {
  Row,
  Span,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  Dropdown,
  Icon,
  Pagination
} from '@startupjs/ui'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons'
import SendMessageForm from '../SendMessageForm'
import './index.styl'

const LIMIT = 10

function Accounts () {
  const [skip, setSkip] = useState(0)
  const [, $visible] = useValue(false)

  const [state, setState] = useState('')

  const [pushs = []] = useQuery('pushs', {
    $limit: LIMIT,
    $skip: skip
  })
  const [pushsCount = 0] = useQuery('pushs', { $count: true })
  const [users = []] = useQuery('users', { _id: { $in: pushs.map(push => push.id) } })
  const [personalId, $personalId] = useValue('')

  function openModal (id) {
    $personalId.set(id)
    $visible.set(true)
  }

  return pug`
    Table.table
      Thead
        Tr
          Th
            Span Email
          Th
            Span Android
          Th
            Span iOS
          Th.cellContent
            Span Options
      if pushs.length
        Tbody
          each push in pushs
            Tr(key=push.id)
              Td
                - let user = users.find(user => user.id === push.id)
                Span= user ? user.email : 'Unauthorized'
              Td
                Span= push.platforms.android ? '✓' : '✗'
              Td
                Span= push.platforms.ios ? '✓' : '✗'
              Td.cell
                Dropdown(
                  value=state
                  onChange=v => setState(v)
                )
                  Dropdown.Caption
                    Row.cellContent
                      Icon(icon=faEllipsisH)
                  Dropdown.Item(value='send' label='Send message' onPress=() => openModal(push.id))
    unless pushsCount < LIMIT
      Row(align='center')
        Pagination(
          count=pushsCount
          limit=LIMIT
          skip=skip
          onChangePage=val => setSkip(val * LIMIT)
        )
    Modal($visible=$visible)
      SendMessageForm(userId=personalId onClose=() => $visible.set(false))
  `
}

export default observer(Accounts)
