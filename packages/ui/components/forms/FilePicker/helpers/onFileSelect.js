import DocumentPicker from 'react-native-document-picker'
import { launchImageLibrary, launchCamera } from 'react-native-image-picker'
import { emit } from 'startupjs'
import { uploadFile } from './'

const CANCELLED_BY_USER_MESSAGE_TEXT = 'Cancelled by user!'

export default async function onFileSelect ({
  path,
  parentId,
  pickOnly,
  pickFromGallery,
  meta = {},
  multiple = false,
  useCamera = false,
  withProgressBar = false,
  quality,
  createThumb,
  pdfPreviewOptions,
  convertToMp4,
  setUniqName,
  onChangeUploading,
  onUploadProgress,
  onUploadStart,
  onSuccess,
  onCancel,
  onError,
  awaitOnUploadAnswer
}) {
  const pickFile = pickFromGallery
    ? launchImageLibrary.bind(null, { selectionLimit: multiple ? 0 : 1 })
    : useCamera
      ? launchCamera.bind(null, { selectionLimit: multiple ? 0 : 1 })
      : DocumentPicker[multiple ? 'pickMultiple' : 'pick']

  function _onUploadProgress (e) {
    onUploadProgress && onUploadProgress(e)
    const percentCompleted = Math.round((e.loaded * 100) / e.total) * 0.85

    emit('FileGlobalUploadProgress.incrProgress', percentCompleted)
  }

  onChangeUploading && onChangeUploading(true)

  if (withProgressBar) {
    emit('FileGlobalUploadProgress.show')
  }

  try {
    const result = await pickFile()

    if (result.didCancel) {
      throw new Error(CANCELLED_BY_USER_MESSAGE_TEXT)
    }

    let files = getFilesFromResult(result)

    if (!Array.isArray(files)) {
      files = [files]
    }

    files = files.map(prepareFile)
    const res = onUploadStart && await onUploadStart(files)

    if ((awaitOnUploadAnswer && res) || !awaitOnUploadAnswer) {
      const promises = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        const fields = {
          path,
          parentId,
          file,
          setUniqName,
          meta,
          quality,
          createThumb,
          pdfPreviewOptions,
          convertToMp4
        }

        if (pickOnly) {
          console.info('[dmapper/files] FilePicker', "File wouldn't be uploaded just picked")
        } else {
          promises.push(
            uploadFile(fields, _onUploadProgress)
          )
        }
      }

      const responses = await Promise.all(promises)
      onSuccess && onSuccess(responses)
    }
  } catch (err) {
    if (
      DocumentPicker.isCancel(err) ||
      err.message === CANCELLED_BY_USER_MESSAGE_TEXT
    ) {
      // User cancelled the picker, exit any dialogs or menus and move on
      console.log('Cancelled by user!')
      onCancel && onCancel()
    } else {
      onError && onError(err)
      throw err
    }
  } finally {
    if (withProgressBar) {
      emit('FileGlobalUploadProgress.hide')
    }
    onChangeUploading && onChangeUploading(false)
  }
}

function getFilesFromResult (result) {
  // get files as result from different API's
  return result.assets || result
}

function prepareFile (file = {}) {
  // Make file fields consistent between two API's
  // (react-native-dociment-picker and react-native-image-picker)
  // for now the difference is only in fileName field

  return {
    name: file.name || file.fileName,
    size: file.size || file.fileSize,
    ...file
  }
}
