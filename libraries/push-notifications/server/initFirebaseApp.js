import * as fadmin from 'firebase-admin'
import fs from 'fs'

export default function initFirebaseApp (serviceAccountPath) {
  if (!serviceAccountPath) {
    throw new Error('[@startupjs/push-notifications]: No serviceAccountPath in initFirebaseApp')
  }

  const serviceAccount = fs.readFileSync(serviceAccountPath)
  fadmin.initializeApp({
    credential: fadmin.credential.cert(JSON.parse(serviceAccount))
  })
}
