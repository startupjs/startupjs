import { createPlugin } from 'startupjs/registry'
import { BaseModel } from 'startupjs/orm'
import { sqlite } from 'startupjs/server'
import busboy from 'busboy'
import sharp from 'sharp'
import { GET_FILE_URL, UPLOAD_SINGLE_FILE_URL, DELETE_FILE_URL, getFileUrl, getUploadFileUrl, getDeleteFileUrl } from './constants.js'

export default createPlugin({
  name: 'files',
  enabled: true,
  order: 'system ui',
  isomorphic: () => ({
    models: models => {
      if (models.files) throw Error(ERRORS.modelAlreadyExists)
      return {
        ...models,
        files: {
          default: FilesModel,
          schema
        },
        'files.*': {
          default: FileModel
        }
      }
    }
  }),
  server: () => ({
    api: expressApp => {
      expressApp.get(GET_FILE_URL, async (req, res) => {
        let { fileId } = req.params
        // if id has extension, remove it
        // (extension is sometimes added for client libraries to properly handle the file)
        fileId = fileId.replace(/\.[^.]+$/, '')
        // url might have ?download=true which means we should force download
        const download = (req.query?.download != null)
        const $root = req.model
        const $file = $root.scope('files.' + fileId)
        await $file.subscribe()
        const file = $file.get()
        if (!file) return res.status(404).send(ERRORS.fileNotFound)
        const { mimeType, storageType, filename } = file
        if (!mimeType) return res.status(500).send(ERRORS.fileMimeTypeNotSet)
        if (!storageType) return res.status(500).send(ERRORS.fileStorageTypeNotSet)
        try {
          // If you want the browser to download the file instead of displaying it
          // res.setHeader('Content-Disposition', `attachment; filename="${row.name}"`);
          let fileBuffer
          if (storageType === 'sqlite') {
            const blob = await getFileBlobFromSqlite(fileId)
            fileBuffer = Buffer.from(blob) // Convert BLOB to buffer
          } else {
            throw Error(ERRORS.unsupportedStorageType(storageType))
          }
          res.type(mimeType) // Set the Content-Type header
          if (download) {
            // Force the file to be downloaded by setting the Content-Disposition header
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
          }
          res.send(fileBuffer)
        } catch (err) {
          console.error(err)
          res.status(500).send('Error getting file')
        }
      })

      // this handles both creating and updating a file
      expressApp.post(UPLOAD_SINGLE_FILE_URL, (req, res) => {
        let { fileId } = req.params
        const $root = req.model
        const bb = busboy({ headers: req.headers })

        let blob
        let meta
        bb.on('file', (fieldname, file, { filename, mimeType, encoding }) => {
          if (blob) return res.status(500).send('Only one file is allowed')

          const buffers = []
          let stream = file

          if (mimeType.startsWith('image/')) {
            // If it's an image, pipe it through sharp for resizing and conversion
            stream = file.pipe(sharp()
              .resize(1000, 1000, {
                fit: sharp.fit.inside,
                withoutEnlargement: true
              })
              .toFormat('jpeg', { quality: 80 })) // Convert to JPEG with 85% quality

            filename = filename.replace(/\.[^.]+$/, '.jpg') // Change extension to .jpg
            mimeType = 'image/jpeg'
          }

          // Regardless of whether it's an image or not, collect the data
          stream.on('data', data => buffers.push(data))

          stream.on('end', async () => {
            blob = Buffer.concat(buffers)
            meta = { filename, mimeType, encoding } // Update meta here to ensure it includes modifications for images

            if (!blob) return res.status(500).send('No file was uploaded')
            // only support sqlite for now
            if (!sqlite) throw Error(ERRORS.noSqlite)
            meta.storageType = 'sqlite'
            // extract extension from filename
            console.log('meta.filename', meta.filename)
            const extension = meta.filename?.match(/\.([^.]+)$/)?.[1]
            if (extension) meta.extension = extension
            const create = !fileId
            if (!fileId) fileId = $root.id()
            // try to save file to sqlite first to do an early exit if it fails
            await saveFileBlobToSqlite(fileId, blob)
            if (create) {
              const doc = { id: fileId, ...meta }
              // if some of the meta fields were undefined, remove them from the doc
              for (const key in meta) {
                if (meta[key] == null) delete doc[key]
              }
              await $root.scope('files').addNew(doc)
            } else {
              const $file = $root.scope('files.' + fileId)
              await $file.subscribe()
              const doc = { ...$file.get(), ...meta }
              // if some of the meta fields were undefined, remove them from the doc
              for (const key in meta) {
                if (meta[key] == null) delete doc[key]
              }
              await $file.setDiffDeep(doc)
            }
            console.log('Uploaded file', fileId)
            res.json({ fileId })
          })
        })

        return req.pipe(bb)
      })

      expressApp.post(DELETE_FILE_URL, async (req, res) => {
        const { fileId } = req.params
        const $root = req.model
        const $file = $root.scope('files.' + fileId)
        await $file.subscribe()
        const file = $file.get()
        if (!file) return res.status(404).send(ERRORS.fileNotFound)
        const { storageType } = file
        if (!storageType) return res.status(500).send(ERRORS.fileStorageTypeNotSet)
        try {
          if (storageType === 'sqlite') {
            await deleteFileFromSqlite(fileId)
          } else {
            throw Error(ERRORS.unsupportedStorageType(storageType))
          }
          await $file.del()
          res.json({ fileId })
        } catch (err) {
          console.error(err)
          res.status(500).send('Error deleting file')
        }
      })
    }
  })
})

const schema = {
  storageType: { type: 'string', required: true },
  mimeType: { type: 'string', required: true },
  filename: { type: 'string' }, // original filename with extension
  encoding: { type: 'string' },
  extension: { type: 'string' },
  createdAt: { type: 'number', required: true }
}

class FilesModel extends BaseModel {
  async addNew (file) {
    return await this.add({
      ...file,
      createdAt: Date.now()
    })
  }

  getUrl (fileId, extension) {
    return getFileUrl(fileId, extension)
  }

  getDownloadUrl (fileId, extension) {
    return getFileUrl(fileId, extension) + '?download=true'
  }

  getUploadUrl (fileId) {
    return getUploadFileUrl(fileId)
  }

  getDeleteUrl (fileId) {
    return getDeleteFileUrl(fileId)
  }
}

class FileModel extends BaseModel {
  getUrl () {
    const { id, extension } = this.get()
    return getFileUrl(id, extension)
  }

  getDownloadUrl () {
    return this.getUrl() + '?download=true'
  }

  getUploadUrl () {
    const { id } = this.get()
    return getUploadFileUrl(id)
  }

  getDeleteUrl () {
    const { id } = this.get()
    return getDeleteFileUrl(id)
  }
}

async function getFileBlobFromSqlite (fileId) {
  if (!sqlite) throw Error(ERRORS.noSqlite)
  return await new Promise((resolve, reject) => {
    sqlite.get('SELECT * FROM files WHERE id = ?', [fileId], (err, row) => {
      if (err) return reject(err)
      if (!row) return reject(ERRORS.fileNotFoundInSqlite)
      if (!row.data) return reject(ERRORS.fileDataNotFoundInSqlite)
      resolve(row.data)
    })
  })
}

async function saveFileBlobToSqlite (fileId, blob) {
  if (!sqlite) throw Error(ERRORS.noSqlite)
  return await new Promise((resolve, reject) => {
    sqlite.run('INSERT OR REPLACE INTO files (id, data) VALUES (?, ?)', [fileId, blob], err => {
      if (err) return reject(err)
      resolve()
    })
  })
}

async function deleteFileFromSqlite (fileId) {
  if (!sqlite) throw Error(ERRORS.noSqlite)
  return await new Promise((resolve, reject) => {
    sqlite.run('DELETE FROM files WHERE id = ?', [fileId], err => {
      if (err) return reject(err)
      resolve()
    })
  })
}

const ERRORS = {
  modelAlreadyExists: '[@startupjs/ui] FileInput: "files" model already exist',
  fileNotFound: 'File not found',
  fileMimeTypeNotSet: 'File mimeType is not set. This should never happen',
  fileStorageTypeNotSet: 'File storageType is not set. This should never happen',
  noSqlite: `
    [@startupjs/ui] FileInput: You tried getting file from SQlite,
    but it's not used in your project.
    This should never happen.
    If you migrated your DB from local SQLite in dev
    to MongoDB in production, you must reupload all your files from SQLite to MongoDB
    while also changing 'storageType' to 'mongo' in your 'files' collection.
  `,
  fileNotFoundInSqlite: `
    File exists in 'files' collection but was not found in SQLite.
    This should never happen.
    Files in 'files' collection are out of sync with SQLite's 'files' table.
  `,
  fileDataNotFoundInSqlite: `
    File exists in SQLite but its data was not found.
    This should never happen.
    Some error probably occurred while uploading the file.
  `,
  unsupportedStorageType: storageType => `
    [@startupjs/ui] FileInput: Unsupported storageType "${storageType}"
  `
}
