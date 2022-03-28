export default async function loadAuthData ({ req }) {
  const { model, body } = req
  const { email } = body
  const authQuery = model.query('auths', {
    $or: [
      { 'providers.local.email': email },
      { 'providers.local.id': email }
    ]
  })
  await authQuery.fetchAsync()
  const id = authQuery.getIds()[0]
  if (!id) return
  let data = model.scope('auths.' + id)
  data = data.get()
  authQuery.unfetch()
  return data
}
