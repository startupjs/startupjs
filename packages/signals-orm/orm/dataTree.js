import { observable, raw } from '@nx-js/observer-util'
import jsonDiff from 'json0-ot-diff'
import diffMatchPatch from 'diff-match-patch'
import { getConnection } from './connection.js'

const ALLOW_PARTIAL_DOC_CREATION = false

export const dataTreeRaw = {}
const dataTree = observable(dataTreeRaw)

export function get (segments, tree = dataTree) {
  let dataNode = tree
  for (const segment of segments) {
    if (dataNode == null) return dataNode
    dataNode = dataNode[segment]
  }
  return dataNode
}

export function getRaw (segments) {
  return get(segments, dataTreeRaw)
}

export function set (segments, value, tree = dataTree) {
  let dataNode = tree
  let dataNodeRaw = raw(dataTree)
  for (let i = 0; i < segments.length - 1; i++) {
    const segment = segments[i]
    if (dataNode[segment] == null) {
      // if next segment is a number, it means that we are in the array
      if (typeof segments[i + 1] === 'number') dataNode[segment] = []
      else dataNode[segment] = {}
    }
    dataNode = dataNode[segment]
    dataNodeRaw = dataNodeRaw[segment]
  }
  const key = segments[segments.length - 1]
  // handle adding out of bounds empty element to the array
  if (value == null && Array.isArray(dataNodeRaw) && key >= dataNodeRaw.length) {
    // inject new undefined elements to the end of the array
    dataNode.splice(dataNodeRaw.length, key - dataNodeRaw.length + 1,
      ...Array(key - dataNodeRaw.length + 1).fill(undefined))
    return
  }
  // handle when the value didn't change
  if (value === dataNodeRaw[key]) return
  // handle setting undefined value
  if (value == null) {
    if (Array.isArray(dataNodeRaw)) {
      // if parent is an array -- we set array element to undefined
      // IMPORTANT: JSON serialization will replace `undefined` with `null`
      //            so if the data will go to the server, it will be serialized as `null`.
      //            And when it comes back from the server it will be still `null`.
      //            This can lead to confusion since when you set `undefined` the value
      //            might end up becoming `null` for seemingly no reason (like in this case).
      dataNode[key] = undefined
    } else {
      // if parent is an object -- we completely delete the property.
      // Deleting the property is better for the JSON serialization
      // since JSON does not have `undefined` values and replaces them with `null`.
      delete dataNode[key]
    }
    return
  }
  // just set the new value
  dataNode[key] = value
}

export function del (segments, tree = dataTree) {
  let dataNode = tree
  for (let i = 0; i < segments.length - 1; i++) {
    const segment = segments[i]
    if (dataNode[segment] == null) return
    dataNode = dataNode[segment]
  }
  if (Array.isArray(dataNode)) {
    // remove the element from the array
    dataNode.splice(segments[segments.length - 1], 1)
  } else {
    // remove the property from the object
    delete dataNode[segments[segments.length - 1]]
  }
}

export async function setPublicDoc (segments, value, deleteValue = false) {
  if (segments.length === 0) throw Error(ERRORS.publicDoc(segments))
  if (segments.length === 1) {
    // set multiple documents at the same time
    if (typeof value !== 'object') throw Error(ERRORS.notObjectCollection(segments, value))
    for (const docId in value) {
      await setPublicDoc([segments[0], docId], value[docId])
    }
  }
  const [collection, docId] = segments
  if (typeof docId === 'number') throw Error(ERRORS.publicDocIdNumber(segments))
  if (docId === 'undefined') throw Error(ERRORS.publicDocIdUndefined(segments))
  if (!(collection && docId)) throw Error(ERRORS.publicDoc(segments))
  const doc = getConnection().get(collection, docId)
  if (!doc.data && deleteValue) throw Error(ERRORS.deleteNonExistentDoc(segments))
  // make sure that the value is not observable to not trigger extra reads. And clone it
  value = raw(value)
  if (value == null) {
    value = undefined
  } else {
    value = JSON.parse(JSON.stringify(value))
  }
  if (segments.length === 2 && !doc.data) {
    // > create a new doc. Full doc data is provided
    if (typeof value !== 'object') throw Error(ERRORS.notObject(segments, value))
    const newDoc = value
    return new Promise((resolve, reject) => {
      doc.create(newDoc, err => err ? reject(err) : resolve())
    })
  } else if (!doc.data) {
    // >> create a new doc. Partial doc data is provided (subpath)
    // NOTE: We throw an error when trying to set a subpath on a non-existing doc
    //       to prevent potential mistakes. In future we might allow it though.
    if (!ALLOW_PARTIAL_DOC_CREATION) throw Error(ERRORS.partialDocCreation(segments, value))
    const newDoc = {}
    set(segments.slice(2), value, newDoc)
    return new Promise((resolve, reject) => {
      doc.create(newDoc, err => err ? reject(err) : resolve())
    })
  } else if (segments.length === 2 && (deleteValue || value == null)) {
    // > delete doc
    return new Promise((resolve, reject) => {
      doc.del(err => err ? reject(err) : resolve())
    })
  } else if (segments.length === 2) {
    // > modify existing doc. Full doc modification
    if (typeof value !== 'object') throw Error(ERRORS.notObject(segments, value))
    const oldDoc = getRaw([collection, docId])
    const diff = jsonDiff(oldDoc, value, diffMatchPatch)
    return new Promise((resolve, reject) => {
      doc.submitOp(diff, err => err ? reject(err) : resolve())
    })
  } else {
    // > modify existing doc. Partial doc modification
    const oldDoc = getRaw([collection, docId])
    const newDoc = JSON.parse(JSON.stringify(oldDoc))
    if (deleteValue) {
      del(segments.slice(2), newDoc)
    } else {
      set(segments.slice(2), value, newDoc)
    }
    const diff = jsonDiff(oldDoc, newDoc, diffMatchPatch)
    return new Promise((resolve, reject) => {
      doc.submitOp(diff, err => err ? reject(err) : resolve())
    })
  }
}

export default dataTree

const ERRORS = {
  publicDoc: segments => `Public doc should have collection and docId. Got: ${segments}`,
  nonExistingDoc: segments => `
    Trying to modify a non-existing doc ${segments}.
    Make sure you have subscribed to the doc before modifying it OR creating it.
  `,
  notObject: (segments, value) => `
    Trying to set a non-object value to a public doc ${segments}.
    Value: ${value}
  `,
  notObjectCollection: (segments, value) => `
    Trying to set multiple documents for the collection but the value passed is not an object.
    Path: ${segments}
    Value: ${value}
  `,
  publicDocIdNumber: segments => `
    Public doc id must be a string. Got a number: ${segments}
  `,
  deleteNonExistentDoc: segments => `
    Trying to delete data from a non-existing doc ${segments}.
    Make sure that the document exists and you are subscribed to it
    before trying to delete anything from it or the doc itself.
  `,
  publicDocIdUndefined: segments => `
    Trying to modify a public document with the id 'undefined'.
    It's most likely a bug in your code and the variable you are using to store
    the document id is not initialized correctly.
    Got path: ${segments}
  `,
  partialDocCreation: (segments, value) => `
    Can't set a value to a subpath of a document which doesn't exist.

    You have probably forgotten to subscribe to the document.
    You MUST subscribe to an existing document with 'sub()' before trying to modify it.

    If instead you want to create a new document, you must provide the full data for it
    and set it for the $.collection.docId signal.

    Path: ${segments}
    Value: ${value}
  `
}
