import * as fadmin from 'firebase-admin'
import fs from 'fs'

export default function initFirebaseApp (serviceAccountPath) {
  console.log('serviceAccountPath: ', serviceAccountPath)
  if (!serviceAccountPath) {
    throw new Error('[@startupjs/push-notifications]: No serviceAccountPath in initFirebaseApp')
  }

  const serviceAccount = fs.readFileSync(serviceAccountPath)

  console.log('JSON.parse(serviceAccount): ', JSON.parse(serviceAccount))
  fadmin.initializeApp({
    credential: fadmin.credential.cert(JSON.parse(serviceAccount))
  })
}
