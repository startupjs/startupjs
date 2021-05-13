import * as fadmin from 'firebase-admin'

const DEFAULT_PLATFORMS = ['ios', 'android']

// data: {
//  userIds: array
//  title: string,
//  body: string,
//  filters: {
//   platforms: ['ios', 'android']
// }
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

  await fadmin.messaging().sendToDevice(
    tokens,
    {
      notification: {
        title: data.options?.title || '',
        body: data.options.body,
        android_channel_id: data.options?.androidChannelId || 'default'
      },
      data: data.options?.data || {}
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
