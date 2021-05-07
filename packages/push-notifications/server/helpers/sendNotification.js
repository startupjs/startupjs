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
  const $pushs = model.query('pushs', {
    _id: { $in: data.userIds }
  })
  await $pushs.subscribe()
  const pushs = $pushs.get()
  $pushs.unsubscribe()

  const tokens = []

  const platforms = getPlatforms(data.filters)
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
        title: data.title,
        body: data.body,
        android_channel_id: data.androidChannelId
      },
      data: {
        ...data.data
      }
    }
  )
}

function getPlatforms (filters) {
  if (filters.platforms?.length) {
    return filters.platforms
  } else {
    return DEFAULT_PLATFORMS
  }
}
