import express from 'express'
import initDefaultRoutes from './initDefaultRoutes'

const router = express.Router()

export default function (ee, options) {
  initDefaultRoutes(router, options)
  ee.on('afterSession', expressApp => {
    expressApp.use(router)
  })
}
