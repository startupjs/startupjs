import express from 'express'
import createServeZip from 'serve-static-zip'
import fs from 'fs'
import path from 'path'
import { PLUGIN_MODEL_PATH } from '../constants'

const HOUR = 1000 * 60 * 60

const DEFAULT_URL = '/promo'
const DEFAULT_FOLDER = path.join(process.cwd(), 'promo')

export function serveStaticPromo ({ url = DEFAULT_URL, zipPath } = {}) {
  const router = express.Router()
  try {
    if (!zipPath) zipPath = findDefaultZipPath()
  } catch (err) {
    console.warn(`WARNING!!! [@dmapper/promo]: ${err.message}`)
    return router
  }
  const zip = createServeZip('/', { maxAge: HOUR })
  // redirect to same path but with trailing '/'. This is needed for index.html retrieval to fire.
  router.use((req, res, next) => {
    if (req.path === url) return res.redirect(`${url}/`)
    next()
  })
  router.use(url, zip.handler)
  zip.updateZip(fs.readFileSync(zipPath))
  router.use((req, res, next) => {
    req.model.scope(PLUGIN_MODEL_PATH).set('hasPromo', true)
    next()
  })
  return router
}

function findDefaultZipPath () {
  if (!fs.existsSync(DEFAULT_FOLDER)) throw Error('No /promo folder found in project directory')
  for (const file of fs.readdirSync(DEFAULT_FOLDER)) {
    console.log('> file', file)
    if (/\.zip$/.test(file)) return path.join(DEFAULT_FOLDER, file)
  }
  throw Error('No .zip file found in /promo folder')
}
