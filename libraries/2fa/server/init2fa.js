import express from 'express'
import initDefaultRoutes from './initDefaultRoutes.js'

const router = express.Router()

export default function (ee, options) {
  console.warn('\x1b[33m%s\x1b[0m', '@startupjs/2fa is deprecated. Use @startupjs/2fa-totp-authentication instead. It has same API.')
  initDefaultRoutes(router, options)
  ee.on('afterSession', expressApp => {
    expressApp.use(router)
  })
}
