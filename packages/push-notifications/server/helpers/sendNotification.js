import * as fadmin from 'firebase-admin'

const DEFAULT_PLATFORMS = ['ios', 'android']

// data: {
//  userIds: array,
//  options: {
//    title: string,
//    body: string,
//    androidChannelId: string,
//    filters: {
//      platforms: ['ios', 'android']
//    },
//    data: object
// }

export default async function sendNotification (model, data) {
  if (!data.userIds) {
    console.error('[@startupjs/push-notifications/sendNotification]: userIds is required!')
    return
  }
  if (!data.options.body) {
    console.error('[@startupjs/push-notifications/sendNotification]: body is required!')
    return
  }

  const $pushs = model.query('pushs', {
    _id: { $in: data.userIds }
  })
  await $pushs.subscribe()
  const pushs = $pushs.get()
  $pushs.unsubscribe()

  const tokens = []

  const platforms = getPlatforms(data.options?.filters)
  pushs.forEach(el => {
    platforms.forEach(platform => {
      if (el.platforms[platform]) {
        tokens.push(el.platforms[platform])
      }
    })
  })

  const _data = setDefaults(data)

  saveMessage(model, _data, tokens)

  if (!tokens.length) return

  await fadmin.messaging().sendToDevice(
    tokens,
    {
      notification: {
        title: _data.options.title,
        body: _data.options.body,
        android_channel_id: _data.options.androidChannelId
      },
      data: _data.options.data
    }
  )
}

function getPlatforms (filters) {
  if (filters?.platforms?.length) {
    return filters.platforms
  } else {
    return DEFAULT_PLATFORMS
  }
}

function setDefaults (data) {
  const _data = data

  if (!data.options?.title) {
    _data.options.title = ''
  }

  if (!data.options?.androidChannelId) {
    _data.options.androidChannelId = 'default'
  }

  if (!data.options.data) {
    _data.options.data = {}
  }

  return _data
}

function saveMessage (model, data) {
  const $pushMessages = model.at('pushMessages')

  $pushMessages.add({
    ...data,
    createdAt: Date.now()
  })
}