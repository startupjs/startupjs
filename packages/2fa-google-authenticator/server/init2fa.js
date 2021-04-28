import express from 'express'
import initDefaultRoutes from './initDefaultRoutes'

const router = express.Router()

export default function (ee, options) {
  console.log('@startupjs/2fa is deprecated. Use @startupjs/2fa-google-authenticator instead. It has same API.')
  initDefaultRoutes(router, options)
  ee.on('afterSession', expressApp => {
    expressApp.use(router)
  })
}
