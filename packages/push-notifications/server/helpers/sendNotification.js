import sendPush from './sendPush'
import { getBackend } from './singletonBackend'

export default async function sendNotification (userIds, options) {
  const model = getBackend().createModel()
  await sendPush(model, userIds, options)
  model.close()
}
