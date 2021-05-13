import { $root } from 'startupjs'

export default async function registerDevice (userId, token) {
  const $push = $root.scope(`pushs.${userId}`)
  await $push.subscribe()
  const push = $push.get()

  if (!push) {
    $root.add('pushs', {
      id: userId,
      platforms: {
        [token.os]: token.token
      }
    })
  } else {
    $push.setDiff(`platforms.${token.os}`, token.token)
  }

  $push.unsubscribe()
}
