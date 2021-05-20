import { $root } from 'startupjs'

export default async function getAllRegistredUserIds () {
  const $pushs = $root.query('pushs', {})
  await $pushs.subscribe()

  const pushs = $pushs.get()
  $pushs.unsubscribe()

  return pushs.map(push => push.id)
}
