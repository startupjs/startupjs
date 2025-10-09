import { sqlite } from 'startupjs/server'

export async function validateSupport () {
  if (!sqlite) throw Error(ERRORS.disabled)
}

export async function getFileBlob (fileId) {
  return await new Promise((resolve, reject) => {
    sqlite.get('SELECT * FROM files WHERE id = ?', [fileId], (err, row) => {
      if (err) return reject(err)
      if (!row) return reject(ERRORS.fileNotFoundInSqlite)
      if (!row.data) return reject(ERRORS.fileDataNotFoundInSqlite)
      resolve(row.data)
    })
  })
}

export async function saveFileBlob (fileId, blob) {
  return await new Promise((resolve, reject) => {
    sqlite.run('INSERT OR REPLACE INTO files (id, data) VALUES (?, ?)', [fileId, blob], err => {
      if (err) return reject(err)
      resolve()
    })
  })
}

export async function deleteFile (fileId) {
  return await new Promise((resolve, reject) => {
    sqlite.run('DELETE FROM files WHERE id = ?', [fileId], err => {
      if (err) return reject(err)
      resolve()
    })
  })
}

const ERRORS = {
  disabled: `
    [@startupjs/ui] FileInput: You tried getting file from SQlite,
    but it's not used in your project.
    ('storageType' is set to 'sqlite' in the 'files' document).
    This should never happen.
    If you migrated your DB from local SQLite in dev
    to MongoDB in production, you must reupload all your files from SQLite to MongoDB
    while also changing 'storageType' to 'mongo' in your 'files' collection.
  `
}
