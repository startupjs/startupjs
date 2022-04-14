import React, { useState } from 'react'
import { $root, observer, useQuery } from 'startupjs'
import {
  Button,
  Br,
  Card,
  Div,
  Row,
  Span
} from '@startupjs/ui'
import PropTypes from 'prop-types'
import { confirm } from 'clientHelpers'
import { DB_COLLECTION_NAME } from '../../../isomorphic/constants'
import SchoolModal from './SchoolModal'

import './index.styl'

function List ({ collection, tableId }) {
  const [showModal, setShowModal] = useState(false)
  const [schools] = useQuery(collection, {})

  async function delSchool (id) {
    if (!await confirm('Are you sure you want to delete the school')) return
    await $root.del(`${collection}.${id}`)
  }

  return pug`
    Row(align="right")
      Button(
        variant='flat'
        color='primary'
        onPress=() => setShowModal(true)
      ) Add a school
    Br
    Div.items
      each school in schools
        Card.item(key=school.name)
          Div
            Span.itemName=school.name
          Div.itemSecret
            Span(bold) Consumer key:
            Span= school.key
          Div.itemSecret
            Span(bold) Consumer secret:
            Span= school.secret
          Button.itemDelete(onPress=() => delSchool(school.id)) Remove
    if showModal
      SchoolModal(collection=collection onClose=() => setShowModal(false))
  `
}

List.defaultProps = {
  collection: DB_COLLECTION_NAME
}

List.propTypes = {
  collection: PropTypes.string
}

export default observer(List)
