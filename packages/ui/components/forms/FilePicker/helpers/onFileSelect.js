import DocumentPicker from 'react-native-document-picker'
import { launchImageLibrary, launchCamera } from 'react-native-image-picker'

const CANCELLED_BY_USER_MESSAGE_TEXT = 'Cancelled by user!'

export default async function onFileSelect ({
  accept,
  multiple = false,
  onSelectFiles,
  useCamera,
  useGallery
}) {
  const pickFile = useGallery
    ? launchImageLibrary.bind(null, { selectionLimit: multiple ? 0 : 1 })
    : useCamera
      ? launchCamera.bind(null, { selectionLimit: multiple ? 0 : 1 })
      : DocumentPicker.pick

  try {
    const result = useGallery || useCamera
      ? await pickFile()
      : await pickFile({ allowMultiSelection: multiple })
    if (result.didCancel) throw new Error(CANCELLED_BY_USER_MESSAGE_TEXT)

    let files = getFilesFromResult(result)
    if (!Array.isArray(files)) {
      files = [files]
    }

    files = files.map(prepareFile)
    onSelectFiles && onSelectFiles(files)
  } catch (err) {
    console.log('err:', err)
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
