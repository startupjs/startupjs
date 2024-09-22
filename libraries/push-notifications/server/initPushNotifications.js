import express from 'express'
import * as fadmin from 'firebase-admin'
import { setBackend } from './helpers/singletonBackend.js'
import initDefaultRoutes from './initDefaultRoutes.js'

const router = express.Router()

export default function initPushNotifications (ee, options) {
  if (!fadmin.apps.length) {
    throw new Error('[@startupjs/push-notifications]: Firebase App was not inicialized! See https://startupjs-ui.dmapper.co/docs/libraries/push-notofications#server')
  }
  initDefaultRoutes(router, options)
  ee.on('backend', backend => {
    setBackend(backend)
  })
  ee.on('routes', expressApp => {
    expressApp.use(router)
  })
}
