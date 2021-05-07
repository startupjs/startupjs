import { $root } from 'startupjs'

export default async function registerDevice (userId, token) {
  const $pushAcc = $root.scope(`pushs.${userId}`)
  await $pushAcc.subscribe()
  const pushAcc = $pushAcc.get()

  if (!pushAcc) {
    $root.add('pushs', {
      id: userId,
      platforms: {
        [token.os]: token.token
      }
    })
  } else {
    $pushAcc.set(`platforms.${token.os}`, token.token)
  }

  $pushAcc.unsubscribe()
}
