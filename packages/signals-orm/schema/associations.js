import GUID_PATTERN from './GUID_PATTERN.js'

export function belongsTo (collectionName) {
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

export function hasManyFlags (collectionName) {
  return {
    type: 'object',
    patternProperties: {
      [GUID_PATTERN]: { type: 'boolean' }
    },
    additionalProperties: false,
    $association: {
      type: 'hasManyFlags',
      collection: collectionName
    }
  }
}

export function hasOne (collectionName) {
  return {
    type: 'string',
    pattern: GUID_PATTERN,
    $association: {
      type: 'hasOne',
      collection: collectionName
    }
  }
}
