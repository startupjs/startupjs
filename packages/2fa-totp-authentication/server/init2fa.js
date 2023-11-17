import express from 'express'
import initDefaultRoutes from './initDefaultRoutes.js'

const router = express.Router()
let isInited = false

export default function (ee, options) {
  if (isInited) return
  isInited = true

  initDefaultRoutes(router, options)
  ee.on('routes', expressApp => {
    expressApp.use(router)
  })
}
