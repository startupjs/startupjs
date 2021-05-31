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

  const [pushs] = useQuery('pushs', {
    $limit: LIMIT,
    $skip: skip
  })
  const [pushsCount] = useQuery('pushs', { $count: true })
  const [users] = useQuery('users', { _id: { $in: pushs.map(push => push.id) } })
  const [personalIds, $personalIds] = useValue([])

  function openModal (id) {
    $personalIds.push(id)
    $visible.set(true)
  }

  function onClose () {
    $visible.set(false)
    $personalIds.set([])
  }

  return pug`
    Table.table
      Thead
        Tr
          Th Email
          Th Platforms
          Th.cellContent Options
      Tbody
        each push in pushs
          Tr(key=push.id)
            Td
              - let user = users.find(user => user.id === push.id)
              Span= user ? user.email : 'Unauthorized'
            Td= Object.keys(push.platforms).join(', ')
            Td.cellContent
              Dropdown
                Dropdown.Caption
                  Row
                    Icon(icon=faEllipsisH)
                Dropdown.Item(value='send' label='Send message' onPress=() => openModal(push.id))
    Row.pagination(align='center')
      Pagination(
        count=pushsCount
        limit=LIMIT
        skip=skip
        onChangePage=val => setSkip(val * LIMIT)
      )
    Modal($visible=$visible)
      SendMessageForm(userIds=personalIds onClose=onClose)
  `
}

export default observer(Accounts)
