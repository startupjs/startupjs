import { mongoClient } from '@startupjs/backend'
import MongoStore from 'connect-mongo'
import expressSession from 'express-session'
import conf from 'nconf'

const DEFAULT_SESSION_MAX_AGE = 1000 * 60 * 60 * 24 * 365 * 2 // 2 years
function getDefaultSessionUpdateInterval (sessionMaxAge) {
  // maxAge is in ms. Return in s. So it's 1/10nth of maxAge.
  return Math.floor(sessionMaxAge / 1000 / 10)
}

export function createSession (options) {
  let sessionStore
  if (mongoClient) {
    const connectMongoOptions = { client: mongoClient }
    if (options.sessionMaxAge) {
      connectMongoOptions.touchAfter = options.sessionUpdateInterval ||
          getDefaultSessionUpdateInterval(options.sessionMaxAge)
    }
    sessionStore = MongoStore.create(connectMongoOptions)
  }

  return expressSession({
    secret: conf.get('SESSION_SECRET'),
    store: sessionStore,
    cookie: {
      maxAge: options.sessionMaxAge || DEFAULT_SESSION_MAX_AGE,
      secure: options.cookiesSecure || false,
      sameSite: options.sameSite
    },
    saveUninitialized: true,
    resave: false,
    // when sessionMaxAge is set, we want to update cookie expiration time
    // on each request
    rolling: !!options.sessionMaxAge
  })
}
