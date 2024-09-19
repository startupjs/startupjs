import { mongo } from 'startupjs/server'
import { GridFSBucket } from 'mongodb'

let bucket

export function validateSupport () {
  if (!mongo) throw Error(ERRORS.mongoNotAvailable)
  // Initialize the GridFSBucket once
  if (!bucket) {
    bucket = new GridFSBucket(mongo)
  }
}

export async function getFileBlob (fileId) {
  validateSupport()
  const files = await bucket.find({ filename: fileId }).toArray()
  if (!files || files.length === 0) {
    throw new Error(ERRORS.fileNotFound)
  }

  return new Promise((resolve, reject) => {
    const downloadStream = bucket.openDownloadStreamByName(fileId)
    const chunks = []

    downloadStream.on('data', (chunk) => {
      chunks.push(chunk)
    })

    downloadStream.on('error', (err) => {
      reject(err)
    })

    downloadStream.on('end', () => {
      resolve(Buffer.concat(chunks))
    })
  })
}

export async function saveFileBlob (fileId, blob) {
  validateSupport()
  // Delete existing files with the same filename
  const files = await bucket.find({ filename: fileId }).toArray()
  for (const file of files) {
    await bucket.delete(file._id)
  }

  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(fileId)
    uploadStream.end(blob)

    uploadStream.on('error', (err) => {
      reject(err)
    })

    uploadStream.on('finish', () => {
      resolve()
    })
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
