import { readdir } from 'fs/promises'
import { MODELS_PATH } from './constants.js'

export default async (req, res) => {
  const files = await readdir(MODELS_PATH)
  return res.json(files)
}
