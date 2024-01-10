import model from '@startupjs/model'
import isServer from '@startupjs/utils/isServer'

export default function connectModel () {
  if (isServer) return
  // Try to establish connection
  try {
    model.createConnection()
  } catch (err) {
    console.error('Error establishing connection with server', err)
  }
}
