import React, { useState, useEffect } from 'react'
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
  Pagination,
  Checkbox,
  Div,
  Button
} from '@startupjs/ui'
import { faEllipsisH, faMinus } from '@fortawesome/free-solid-svg-icons'
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
  const [users] = useQuery('users', { _id: { $in: pushs.map(push => push.userId) } })

  const [selectedUserIds, setSelectedUserIds] = useState([])
  const [intermediate, setIntermediate] = useState(false)
  const [checkedAll, setCheckedAll] = useState(false)

  useEffect(() => {
    setIntermediate(selectedUserIds.length > 0 && selectedUserIds.length < pushs.length)
    setCheckedAll(selectedUserIds.length === pushs.length)
  }, [selectedUserIds])

  function onChangeAll (value) {
    setCheckedAll(value)
    if (value) {
      setSelectedUserIds(pushs.map(push => push.userId))
    } else {
      setSelectedUserIds([])
    }
  }

  function onChange (value, id) {
    if (value) {
      setSelectedUserIds(prevState => [...prevState, id])
    } else {
      setSelectedUserIds(prevState => prevState.filter(item => item !== id))
    }
  }

  function openModal () {
    $visible.set(true)
  }

  function sendToCertainUser (userId) {
    setSelectedUserIds([userId])
    openModal()
  }

  function onClose () {
    $visible.set(false)
    setSelectedUserIds([])
  }

  const extraProps = {}
  if (intermediate) extraProps.icon = faMinus

  return pug`
    Div.root
      if selectedUserIds.length
        Row
          Button(onPress=openModal) Send to selected
      Table.table(styleName={withButton: selectedUserIds.length})
        Thead
          Tr
            Th
              Checkbox(
                value=checkedAll || intermediate
                onChange=onChangeAll
                ...extraProps
              )
            Th Email
            Th Platforms
            Th.cellContent Options
        Tbody
          each push in pushs
            Tr(key=push.id)
              Td
                Checkbox(
                  value=selectedUserIds.includes(push.userId)
                  onChange=value => onChange(value, push.userId)
                )
              Td
                - let user = users.find(user => user.id === push.userId)
                Span= user ? user.email : 'Unauthorized'
              Td= Object.keys(push.platforms).join(', ')
              Td.cellContent
                Dropdown
                  Dropdown.Caption
                    Row
                      Icon(icon=faEllipsisH)
                  Dropdown.Item(value='send' label='Send message' onPress=() => sendToCertainUser(push.userId))
      Row.pagination(align='center')
        Pagination(
          count=pushsCount
          limit=LIMIT
          skip=skip
          onChangePage=val => setSkip(val * LIMIT)
        )
    Modal($visible=$visible)
      SendMessageForm(userIds=selectedUserIds onClose=onClose)
  `
}

export default observer(Accounts)
