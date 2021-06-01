import { $root } from 'startupjs'

export default async function registerDevice (userId, token) {
  const $pushs = $root.query('pushs', { userId, $limit: 1 })
  await $pushs.subscribe()
  const [push] = $pushs.get()

  if (!push) {
    await $root.add('pushs', {
      userId,
      platforms: {
        [token.os]: token.token
      }
    })
  } else {
    $pushs.setDiff(`platforms.${token.os}`, token.token)
  }

  $pushs.unsubscribe()
}
