import { hasOne } from 'startupjs'

export default {
  name: { type: 'string', required: true },
  age: {
    type: 'number',
    min: 1,
    max: 99,
    description: 'Age'
  },
  photoFileId: {
    ...hasOne('files'),
    input: 'file',
    label: 'Photo',
    mimeTypes: 'image/*'
  }
}
