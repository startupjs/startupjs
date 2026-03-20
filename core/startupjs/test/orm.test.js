import test from 'node:test'
import assert from 'node:assert/strict'

import { Signal, hasMany, belongsTo } from '../index.js'
import { BaseModel, hasMany as ormHasMany, belongsTo as ormBelongsTo } from '../orm.js'

test('startupjs/orm exposes BaseModel as Signal', () => {
  assert.equal(BaseModel, Signal)
})

test('startupjs/orm re-exports relation helpers', () => {
  assert.equal(ormHasMany, hasMany)
  assert.equal(ormBelongsTo, belongsTo)
})
