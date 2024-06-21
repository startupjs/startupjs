/* global it, expect */

import codeToSchema from './codeToSchema.js'

it('schema as a plain JSON-like object', () => {
  const code = /* js */`
    export const schema = {
      name: { type: 'string' },
      age: { type: 'number', min: 0, max: 100 },
      isStudent: { type: 'boolean' },
      tags: { type: 'array', items: { type: 'string' } }
    }
  `
  expect(codeToSchema(code)).toMatchSnapshot()
})

it('with spreads on associations (belongsTo, hasOne, hasMany)', () => {
  const code = /* js */`
    import { belongsTo, hasOne, hasMany, hasManyFlags } from 'startupjs/orm'
    export const schema = {
      eventId: {
        ...belongsTo('events'),
        required: true
      },
      "name": { type: 'string', required: true },
      "photoFileId": {
        ...hasOne('files'),
        input: 'file',
        label: 'Photo',
        mimeTypes: 'image/*'
      },
      likes: {
        ...hasMany('users'),
        input: 'likes'
      },
      likesFlags: {
        ...hasManyFlags('persons'),
        $comment: 'true flags for everyone this person likes',
        input: 'likesFlags'
      },
    }
  `
  expect(codeToSchema(code)).toMatchSnapshot()
})
