import { $, sub } from 'teamplay'
import { v4 as uuid } from 'uuid'

// TODO: sub() on server with fetch does not re-fetch data when calling sub().
//       This has to be implemented correctly for fetches.
//       Because of this here we'll have a race condition if jwtSecret does not exist yet.
let $appSecret
export default async function getAppSecret () {
  if (!$appSecret) $appSecret = await sub($.service.appSecret)
  let value = $appSecret.value.get()
  if (value) return value
  // TODO: fix race condition here in a multi-instance setup.
  //       We'll need to use redlock to acquire a creation lock here
  //       and then if the value was not set yet by another process
  //       we'll set it and release the lock.
  //       Because of the bug with sub() not re-fetching data it won't work atm
  //       since there is no way to actually fetch a new data from the server.
  value = uuid()
  await $appSecret.set({ value })
  return value
}
