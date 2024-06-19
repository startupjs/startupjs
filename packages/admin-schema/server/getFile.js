import { join } from 'path'
import { readFile } from 'fs/promises'
import { MODELS_PATH } from './constants.js'
import codeToSchema from './utils/codeToSchema.js'

export default async (req, res) => {
  const { filename } = req.params
  if (!filename) return res.status(400).send('filename is required')
  const modelPath = join(MODELS_PATH, filename)
  let code
  try {
    code = await readFile(modelPath, 'utf8')
  } catch (err) {
    console.error(err)
    return res.status(500).send('error reading file')
  }
  const schema = codeToSchema(code)
  return res.json(schema)
}
