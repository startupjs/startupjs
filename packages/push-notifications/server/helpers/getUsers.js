export default async function getUsers (model) {
  const $pushUsers = model.query('pushs', {})
  await $pushUsers.subscribe()
  const pushUsers = $pushUsers.get()
  $pushUsers.unsubscribe()
  return pushUsers || []
}
