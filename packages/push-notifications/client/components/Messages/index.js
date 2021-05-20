import React from 'react'
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
  Modal
} from '@startupjs/ui'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import _get from 'lodash/get'
import SendMessageForm from '../SendMessageForm'
import './index.styl'

function Messages () {
  const [, $visible] = useValue(false)
  const [pushMessages = []] = useQuery('pushMessages', {})
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
    Modal($visible=$visible)
      SendMessageForm(onClose=() => $visible.set(false))
  `
}

export default observer(Messages)
