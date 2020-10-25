import model from '@startupjs/model'

export default function connectModel () {
  // Try to establish connection
  try {
    model.createConnection()
  } catch (err) {
    console.error('Error establishing connection with server', err)
  }
}
