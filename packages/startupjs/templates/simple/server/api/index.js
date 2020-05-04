import express from 'express'
import testThing from './testThing'

const router = express.Router()

// All API routes are automatically prefixed with /api (see server/index.js file)

router.get('/test-thing', testThing)

// Add new REST API routes here

export default router
