import { GridFSBucket } from 'mongodb'
import { mongo } from 'startupjs/server'

let bucket

export function validateSupport () {
  if (!mongo) throw Error(ERRORS.mongoNotAvailable)
  // Initialize the GridFSBucket once
  if (!bucket) {
    bucket = new GridFSBucket(mongo)
  }
}

export async function getFileBlob (fileId, range) {
  validateSupport()
  const files = await bucket.find({ filename: fileId }).toArray()
  if (!files || files.length === 0) {
    throw new Error(ERRORS.fileNotFound)
  }

  return new Promise((resolve, reject) => {
    // Performance optimization: use Range requests for partial content
    let downloadStream
    if (range) {
      console.log('[MongoDB GridFS] Using Range request for optimal streaming:', { fileId, range })

      // Validate range boundaries
      const actualFileSize = files[0].length
      if (range.start >= actualFileSize || range.start < 0) {
        console.log('[MongoDB GridFS] Range start out of bounds:', { start: range.start, actualFileSize })
        return reject(new Error('Range start out of bounds'))
      }

      // Ensure end is within file bounds
      let adjustedEnd = Math.min(range.end, actualFileSize - 1)

      // Ensure end is not before start
      if (adjustedEnd < range.start) {
        console.log('[MongoDB GridFS] Invalid range:', { start: range.start, end: adjustedEnd, actualFileSize })
        return reject(new Error('Invalid range'))
      }

      console.log('[MongoDB GridFS] Opening download stream with range:', {
        start: range.start,
        end: adjustedEnd,
        actualFileSize,
        originalEnd: range.end
      })

      downloadStream = bucket.openDownloadStreamByName(fileId, {
        start: range.start,
        end: adjustedEnd
      })

      // Add error handling for stream errors
      downloadStream.on('error', (error) => {
        console.error('[MongoDB GridFS] Stream error:', error)
        reject(error)
      })
    } else {
      // Regular download for non-Range requests (download functionality)
      downloadStream = bucket.openDownloadStreamByName(fileId)
    }

    const chunks = []

    downloadStream.on('data', (chunk) => {
      chunks.push(chunk)
    })

    downloadStream.on('error', (err) => {
      reject(err)
    })

    downloadStream.on('end', () => {
      const result = Buffer.concat(chunks)
      if (range) {
        const expectedSize = range.end - range.start + 1
        console.log('[MongoDB GridFS] Range response:', {
          expected: expectedSize,
          actual: result.length,
          start: range.start,
          end: range.end,
          fileId
        })

        // Validate that we got the expected data
        if (result.length === 0) {
          console.warn('[MongoDB GridFS] Empty range response - this may indicate a problem')
        }
      }
      resolve(result)
    })
  })
}

export async function getFileSize (fileId) {
  validateSupport()
  const files = await bucket.find({ filename: fileId }).toArray()
  if (!files || files.length === 0) {
    throw new Error(ERRORS.fileNotFound)
  }
  return files[0].length
}

export async function saveFileBlob (fileId, blob) {
  console.log('[MongoDB GridFS] Saving file:', {
    fileId,
    blobType: blob ? blob.constructor.name : 'undefined',
    blobLength: blob instanceof Buffer ? blob.length : 'N/A',
  })

  validateSupport()
  // Delete existing files with the same filename
  const files = await bucket.find({ filename: fileId }).toArray()
  for (const file of files) {
    console.log('[MongoDB GridFS] Deleting existing files')
    await bucket.delete(file._id)
  }

  console.log('db', mongo)

  return new Promise((resolve, reject) => {
    console.log('[MongoDB GridFS] Opening upload stream')
    const uploadStream = bucket.openUploadStream(fileId)

    uploadStream.on('data', (chunk) => {
      console.log('[MongoDB GridFS] Stream data received:', { fileId, chunkLength: chunk.length });
    })
    uploadStream.on('end', () => {
      console.log('[MongoDB GridFS] Stream end event:', fileId);
    })
    uploadStream.on('close', () => {
      console.log('[MongoDB GridFS] Stream closed:', fileId);
    })

    uploadStream.on('error', (err) => {
      console.warn('[MongoDB GridFS] error writing to stream', err)
      reject(err)
    })

    uploadStream.on('finish', () => {
      console.log('[MongoDB GridFS] Finished writing to stream')
      resolve()
    })

    try {
      if (blob instanceof Buffer) {
        uploadStream.write(blob)
        uploadStream.end()
      } else if (blob.readable) {
        blob.pipe(uploadStream)
      } else {
        const err = new Error('Unsupported blob type')
        console.error('[MongoDB GridFS] Error:', err)
        reject(err)
      }
    } catch (err) {
      console.error('[MongoDB GridFS] Error writing blob:', err)
      reject(err);
    }

    console.log('here we go')
  })
}

export async function deleteFile (fileId) {
  validateSupport()
  const files = await bucket.find({ filename: fileId }).toArray()
  if (!files || files.length === 0) {
    throw new Error(ERRORS.fileNotFound)
  }

  for (const file of files) {
    await bucket.delete(file._id)
  }
}

const ERRORS = {
  mongoNotAvailable: `
    [@startupjs/ui] FileInput: MongoDB connection is not available.
    Make sure you have connected to MongoDB before using this function.
  `,
  fileNotFound: `
    File not found in MongoDB GridFS.
  `
}
