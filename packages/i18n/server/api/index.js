import express from 'express'
import fs from 'fs'
import resolve from 'resolve'
import { encodePath } from './../../isomorphic/index.js'

const router = express.Router()

router.post('/get-translations', (req, res) => {
  let translations

  try {
    translations = JSON.parse(
      fs.readFileSync(
        getTranslationPath(),
        { encoding: 'utf8' }
      )
    )
  } catch {
    console.error('[@startupjs/i18n]: translations.json not found')
  }

  res.json(translations ? encodeObjectKeys(translations) : {})
})

router.post('/change-language', (req, res) => {
  const { lang } = req.body
  let status

  if (lang) {
    req.session.lang = lang
    status = 200
  } else {
    status = 400
  }

  res.status(status).end()
})

function getTranslationPath () {
  let translationsPath

  try {
    translationsPath = resolve.sync(
      '@startupjs/babel-plugin-i18n-extract/translations.json'
    )
  } catch {
    throw new Error(
      '[@startupjs/i18n]: @startupjs/babel-plugin-i18n-extract not found'
    )
  }

  return translationsPath
}

function encodeObjectKeys (obj) {
  const newObj = {}

  for (const key in obj) {
    const value = obj[key]
    newObj[encodePath(key)] = typeof value === 'object'
      ? encodeObjectKeys(value)
      : value
  }

  return newObj
}

export default router
