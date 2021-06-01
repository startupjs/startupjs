import * as fadmin from 'firebase-admin'

const DEFAULT_PLATFORMS = ['ios', 'android']

// options: {
//  title: string,
//  body: string,
//  platforms: ['ios', 'android']
//  data: object
// }

export default async function sendNotification (model, userIds, options) {
  if (!userIds) {
    console.error('[@startupjs/push-notifications/sendNotification]: userIds is required!')
    return
  }
  if (!options.body) {
    console.error('[@startupjs/push-notifications/sendNotification]: body is required!')
    return
  }

  const $pushs = model.query('pushs', {
    userId: { $in: userIds }
  })
  await $pushs.subscribe()
  const pushs = $pushs.get()

  const tokens = []

  const _options = setDefaults(options, { platforms: DEFAULT_PLATFORMS })

  const platforms = _options.platforms

  pushs.forEach(el => {
    platforms.forEach(platform => {
      if (el.platforms[platform]) {
        tokens.push(el.platforms[platform])
      }
    })
  })

  await saveMessage(model, _options, userIds)

  $pushs.unsubscribe()
  if (!tokens.length) return

  await fadmin.messaging().sendToDevice(
    tokens,
    {
      notification: {
        title: _options.title,
        body: _options.body,
        // only android has channels, thus if we want use this feature for both platforms we need to create custom channels
        android_channel_id: 'default'
      },
      data: _options.data || {}
    }
  )
}

async function saveMessage (model, options, userIds) {
  const $pushMessages = model.at('pushMessages')

  await $pushMessages.add({
    ...options,
    userIds,
    createdAt: Date.now()
  })
}

function setDefaults (options, defaults = {}) {
  const _options = Object.assign({}, options)
  Object.keys(defaults).forEach(key => {
    if (!_options[key]) {
      _options[key] = defaults[key]
    }
  })
  return _options
}
