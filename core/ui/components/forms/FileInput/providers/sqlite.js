import { sqlite } from 'startupjs/server'

export async function validateSupport() {
  if (!sqlite) throw Error(ERRORS.disabled)
}

export async function getFileBlob(fileId, range) {
  return await new Promise((resolve, reject) => {
    sqlite.get('SELECT * FROM files WHERE id = ?', [fileId], (err, row) => {
      if (err) return reject(err)
      if (!row) return reject(new Error(ERRORS.fileNotFoundInSqlite))
      if (!row.data) return reject(new Error(ERRORS.fileDataNotFoundInSqlite))

      const blob = row.data
      const actualFileSize = blob.length

      if (range) {
        console.log('[SQLite] Using Range request for optimal streaming:', { fileId, range })

        // Validate range boundaries
        if (range.start >= actualFileSize || range.start < 0) {
          console.log('[SQLite] Range start out of bounds:', { start: range.start, actualFileSize })
          return reject(new Error('Range start out of bounds'))
        }

        // Ensure end is within file bounds
        let adjustedEnd = Math.min(range.end, actualFileSize - 1)

        // Ensure end is not before start
        if (adjustedEnd < range.start) {
          console.log('[SQLite] Invalid range:', { start: range.start, end: adjustedEnd, actualFileSize })
          return reject(new Error('Invalid range'))
        }

        console.log('[SQLite] Retrieving blob with range:', {
          start: range.start,
          end: adjustedEnd,
          actualFileSize,
          originalEnd: range.end
        })

        // Extract the requested range from the blob
        const result = blob.slice(range.start, adjustedEnd + 1)
        const expectedSize = adjustedEnd - range.start + 1

        console.log('[SQLite] Range response:', {
          expected: expectedSize,
          actual: result.length,
          start: range.start,
          end: adjustedEnd,
          fileId
        })

        if (result.length === 0) {
          console.warn('[SQLite] Empty range response - this may indicate a problem')
        }

        resolve(result)
      } else {
        // Return full blob for non-range requests
        resolve(blob)
      }
    })
  })
}

export async function saveFileBlob(fileId, blob) {
  return await new Promise((resolve, reject) => {
    sqlite.run('INSERT OR REPLACE INTO files (id, data) VALUES (?, ?)', [fileId, blob], err => {
      if (err) return reject(err)
      resolve()
    })
  })
}

export async function deleteFile(fileId) {
  return await new Promise((resolve, reject) => {
    sqlite.run('DELETE FROM files WHERE id = ?', [fileId], err => {
      if (err) return reject(err)
      resolve()
    })
  })
}

export async function getFileSize(fileId) {
  await validateSupport()
  return await new Promise((resolve, reject) => {
    sqlite.get('SELECT data FROM files WHERE id = ?', [fileId], (err, row) => {
      if (err) return reject(err)
      if (!row) return reject(new Error(ERRORS.fileNotFoundInSqlite))
      if (!row.data) return reject(new Error(ERRORS.fileDataNotFoundInSqlite))
      resolve(row.data.length)
    })
  })
}

const ERRORS = {
  disabled: `
    [@startupjs/ui] FileInput: You tried getting file from SQLite,
    but it's not used in your project.
    ('storageType' is set to 'sqlite' in the 'files' document).
    This should never happen.
    If you migrated your DB from local SQLite in dev
    to MongoDB in production, you must reupload all your files from SQLite to MongoDB
    while also changing 'storageType' to 'mongo' in your 'files' collection.
  `,
  fileNotFoundInSqlite: `
    File not found in SQLite.
  `,
  fileDataNotFoundInSqlite: `
    File data not found in SQLite.
  `
}