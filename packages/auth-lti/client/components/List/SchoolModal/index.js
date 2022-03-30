import React from 'react'
import PropTypes from 'prop-types'
import { $root, observer, useValue } from 'startupjs'
import {
  Button,
  ObjectInput,
  Modal,
} from '@startupjs/ui'

import './index.styl'

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

function SchoolModal ({ collection, onClose }) {
  const [school, $school] = useValue({
    key: getRandomString(),
    secret: getRandomString()
  })
  const [errors, $errors] = useValue({})

  async function save () {
    const _errors = {}
    const required = 'Field is required'

    if (!school.name) {
      _errors.name = required
    } else if (!/^[a-z]+$/.test(school.name)) {
      _errors.name = 'Name must be lower case and without spaces'
    } else {
      const $schools = $root.query(collection, {
        $count: true,
        name: school.name
      })
      await $schools.fetch()
      const count = $schools.getExtra()

      if (count) {
        _errors.name = 'Name must be uniq'
      }

      $schools.unfetch()
    }

    if (!school.key) {
      _errors.key = required
    }

    if (!school.secret) {
      _errors.secret = required
    }

    if (Object.keys(_errors).length) {
      $errors.set(_errors)
      return
    }

    await $root.add(collection, school)
    onClose()
  }

  return pug`
    Modal(
      visible=true
      title='Add a school'
      onRequestClose=onClose
    )
      ObjectInput(
        $value=$school
        properties=properties
        errors=errors
      )
      Modal.Actions
        Button.cancel(
          onPress=onClose
        ) Cancel
        Button(
          variant='flat'
          color='primary'
          onPress=save
        ) Save
  `
}

SchoolModal.protoTypes = {
  collections: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
}

export default observer(SchoolModal)
