import { sqlite, mongo } from 'startupjs/server'

export async function getFileBlob (storageType, fileId) {
  return (await getStorageProvider(storageType)).getFileBlob(fileId)
}

export async function saveFileBlob (storageType, fileId, blob) {
  return (await getStorageProvider(storageType)).saveFileBlob(fileId, blob)
}

export async function deleteFile (storageType, fileId) {
  return (await getStorageProvider(storageType)).deleteFile(fileId)
}

export async function getDefaultStorageType () {
  if (mongo) return 'mongo'
  if (sqlite) return 'sqlite'
  throw Error(ERRORS.noDefaultStorageProvider)
}

const moduleCache = {}

async function getStorageProvider (storageType) {
  if (moduleCache[storageType]) return moduleCache[storageType]

  let theModule
  if (storageType === 'sqlite') {
    theModule = await import('./sqlite.js')
  } else if (storageType === 'mongo') {
    theModule = await import('./mongo.js')
  } else {
    throw Error(ERRORS.unsupportedStorageType(storageType))
  }

  await theModule.validateSupport?.()

  moduleCache[storageType] = theModule
  return theModule
}

const ERRORS = {
  unsupportedStorageType: storageType => `
    [@startupjs/ui] FileInput: You tried getting file from storageType '${storageType}',
    but it's not supported.
    This should never happen.
  `,
  noDefaultStorageProvider: `
    [@startupjs/ui] FileInput: No default storage provider can be used.
    Neither MongoDB is used in your project nor SQLite (persistent mingo).
  `
}
