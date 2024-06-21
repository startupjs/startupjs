/* global it, expect */

import schemaToCode from './schemaToCode.js'

it('schema as a plain JSON-like object', async () => {
  const originalCode = /* js */`
    export const schema = {
      name: { type: 'string' },
      age: { type: 'number', min: 0, max: 100 },
      isStudent: { type: 'boolean' },
      tags: { type: 'array', items: { type: 'string' } }
    }
  `
  const schema = {
    name: { type: 'string', placeholder: 'John Smith' },
    age: { type: 'number', min: 18 },
    tags: { type: 'array', items: { type: 'string' } },
    address: { type: 'string' }
  }
  expect(await schemaToCode(schema, originalCode)).toMatchSnapshot()
})

it('with spreads, inserts an import for a new association', async () => {
  const originalCode = /* js */`
    export const schema = {
      name: { type: 'string', required: true }
    }
  `
  const schema = {
    name: { type: 'string', required: true },
    photoFileId: {
      $$code_spread_association: {
        collection: 'files',
        type: 'hasOne'
      },
      input: 'file',
      label: 'Photo',
      mimeTypes: 'image/*'
    }
  }
  expect(await schemaToCode(schema, originalCode)).toMatchSnapshot()
})

it('with spreads on associations (belongsTo, hasOne, hasMany)', async () => {
  const originalCode = /* js */`
    import { hasOne } from 'startupjs/orm'
    export const schema = {
      name: { type: 'string', required: true },
      photoFileId: {
        ...hasOne('files'),
        input: 'file',
        label: 'Photo',
        mimeTypes: 'image/*'
      },
    }
  `
  const schema = {
    eventId: {
      $$code_spread_association: {
        collection: 'events',
        type: 'belongsTo'
      },
      required: true
    },
    likes: {
      $$code_spread_association: {
        collection: 'users',
        type: 'hasMany'
      },
      input: 'likes'
    },
    likesFlags: {
      $$code_spread_association: {
        collection: 'persons',
        type: 'hasManyFlags'
      },
      $comment: 'true flags for everyone this person likes',
      input: 'likesFlags'
    },
    name: {
      required: true,
      type: 'string'
    },
    photoFileIds: {
      $$code_spread_association: {
        collection: 'files',
        type: 'hasMany'
      },
      input: 'file',
      multiple: true,
      label: 'Photo',
      mimeTypes: 'image/*'
    }
  }
  expect(await schemaToCode(schema, originalCode)).toMatchSnapshot()
})
