import sendPush from './sendPush.js'
import { getBackend } from './singletonBackend.js'

export default async function sendNotification (userIds, options) {
  const model = getBackend().createModel()
  try {
    await sendPush(model, userIds, options)
  } catch (err) {
    throw new Error(err)
  } finally {
    model.close()
  }
}
