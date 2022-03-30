import React, { useCallback } from 'react'
import { $root, observer, useValue } from 'startupjs'
import {
  Button,
  Br,
  ObjectInput,
  Modal,
  Row,
} from '@startupjs/ui'
import { SmartTable } from '@dmapper/smart-table/client'
import { DB_COLLECTION_NAME, TABLE_ID } from '../../../isomorphic/constants'

import './index.styl'

const ROW_ID = '_id'

const columns = [
  {
    title: 'Uniq name',
    dataIndex: 'name',
    type: 'string'
  },
  {
    title: 'Key',
    dataIndex: 'key',
    type: 'string',
  },
  {
    title: 'Secret',
    dataIndex: 'secret',
    type: 'string',
  },
  {
    title: 'Redirect url',
    dataIndex: 'redirect',
    type: 'string',
  }
]

function getBaseQuery() {
  return {
    $aggregate: [{
      $match: {
        _type: { $ne: null }
      }
    }]
  }
}

const properties = {
  name: {
    input: 'text',
    label: 'Uniq name (required)'
  },
  key: {
    input: 'text',
    label: 'Key (required)',
  },
  secret: {
    input: 'text',
    label: 'Secret (required)',
  },
  redirect: {
    input: 'text',
    label: 'Redirect',
  }
}

function getRandomString() {
  return $root.id().replaceAll('-', '')
}

export default observer(function PLTISchools ({
  collection = DB_COLLECTION_NAME,
  tableId = TABLE_ID
}) {
  const [, $visible] = useValue(false)
  const [school, $school] = useValue({})
  const [errors, $errors] = useValue({})

  async function save () {
    const _errors = {}
    const required = 'Field is required'
    if (!school.name) {
      _errors.name = required
    }
    if (!school.key) {
      _errors.key = required
    }
    if (!school.secret) {
      _errors.secret = required
    }
    if (school.name) {
      const $schools = $root.query(collection, { name: school.name, $count: true })
      await $schools.fetch()
      const count = $schools.getExtra()
      if (count) {
        _errors.name = 'Name must be uniq'
      }
      $schools.unfetch()
    }

    if (Object.keys(_errors).length) {
      $errors.set(_errors)
      return
    }

    $root.add(collection, school)
    $visible.set(false)
    $school.set({})
  }

  function openModal () {
    $visible.set(true)
    $school.setEach({
      key: getRandomString(),
      secret: getRandomString()
    })
  }

  const renderMenu = useCallback(row => {
    const { _id } = row
    const actions = {
      Delete: async () => {
        const $school = $root.at(`${collection}.${_id}`)
        await $school.fetch()
        $school.del()
        $school.unfetch()
      }
    }
    return { actions }
  }, [])

  return pug`
    Row(align="right")
      Button(
        variant='flat'
        color='primary'
        onPress=openModal
      ) Add a school
    Br
    SmartTable(
      tableId=tableId
      schema=columns
      collection=collection
      rowId=ROW_ID
      renderMenu=renderMenu
      menuColIndex=3
      getBaseQuery=getBaseQuery
    )
    Modal(
      $visible=$visible
      title='Add a school'
      onBackdropPress=() => $school.set({})
    )
      ObjectInput(
        $value=$school
        properties=properties
        errors=errors
      )
      Modal.Actions
        Button.cancel(
          onPress=() => $school.set({})
        ) Cancel
        Button(
          variant='flat'
          color='primary'
          onPress=save
        ) Save
  `
})
