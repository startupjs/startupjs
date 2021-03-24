import express from 'express'
import initRouters from './initRouters'

const router = express.Router()

export default function (ee) {
  initRouters(router)
  ee.on('afterSession', expressApp => {
    expressApp.use(router)
  })
}
