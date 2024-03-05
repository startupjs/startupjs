import {
  belongsTo as oldBelongsTo,
  hasMany as oldHasMany,
  hasOne as oldHasOne
} from './associations/index.js'
import { GUID_PATTERN } from './schemaHelpers.js'

export function belongsTo (collectionName) {
  if (typeof collectionName !== 'string') {
    console.warn(`
      belongsTo(Model) for models is deprecated.
      Convert to use the new schema associations: belongsTo('collectionName')
    `)
    return oldBelongsTo(...arguments)
  }
  return {
    type: 'string',
    pattern: GUID_PATTERN,
    $association: {
      type: 'belongsTo',
      collection: collectionName
    }
  }
}

export function hasMany (collectionName) {
  if (typeof collectionName !== 'string') {
    console.warn(`
      hasMany(Model) for models is deprecated.
      Convert to use the new schema associations: hasMany('collectionName')
    `)
    return oldHasMany(...arguments)
  }
  return {
    type: 'array',
    items: {
      type: 'string',
      pattern: GUID_PATTERN
    },
    $association: {
      type: 'hasMany',
      collection: collectionName
    }
  }
}

export function hasOne (collectionName) {
  if (typeof collectionName !== 'string') {
    console.warn(`
      hasOne(Model) for models is deprecated.
      Convert to use the new schema associations: hasOne('collectionName')
    `)
    return oldHasOne(...arguments)
  }
  return {
    type: 'string',
    pattern: GUID_PATTERN,
    $association: {
      type: 'hasOne',
      collection: collectionName
    }
  }
}
