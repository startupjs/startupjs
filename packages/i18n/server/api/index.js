import express from 'express'
import fs from 'fs'
import path from 'path'
import { encodePath } from './../../isomorphic'

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
    translations = JSON.parse(
      fs.readFileSync(
        getTranslationPath(),
        { encoding: 'utf8' }
      )
    )
  } catch {
    console.error('[@startupjs/i18n]: translations.json not found')
  }

  res.json(translations ? decodeObjectKeys(translations) : {})
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
  let cwd = process.cwd()
  const styleguidePath = 'startupjs/styleguide'
  // workaround for development startupjs
  if (cwd.includes(styleguidePath)) {
    cwd = cwd.replace(styleguidePath, 'startupjs')
  }
  return path.join(cwd, 'node_modules', translationsPath)
}

function decodeObjectKeys (obj) {
  const newObj = {}

  for (const key in obj) {
    const value = obj[key]
    newObj[encodePath(key)] = typeof value === 'object'
      ? decodeObjectKeys(value)
      : value
  }

  return newObj
}

export default router
