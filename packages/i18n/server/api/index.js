import express from 'express'
import fs from 'fs'
import path from 'path'

const router = express.Router()
let translationsPath

try {
  translationsPath =
    require.resolve('@startupjs/babel-plugin-i18n-extract/translations.json')
} catch {
  throw new Error(
    '[@startupjs/i18n]: @startupjs/babel-plugin-i18n-extract not found'
  )
}

router.post('/get-translations', (req, res) => {
  let translations

  try {
    translations = fs.readFileSync(
      // process.cwd().includes('startupjs/styleguide/')
      // TODO: HACK FOR STYLEGUIDE
      path.join(process.cwd(), '..', 'node_modules', translationsPath)
    )
  } catch {
    console.error('[@startupjs/i18n]: translations.json not found')
  }

  res.json(translations ? JSON.parse(translations) : {})
})

export default router
