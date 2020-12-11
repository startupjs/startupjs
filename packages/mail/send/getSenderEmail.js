export default async function getSenderEmail (model, options = {}) {
  const { from, senderId, domain, host } = options

  if (senderId) {
    const $auth = model.scope(`auths.${senderId}`)
    await $auth.subscribe()
    const senderEmail = $auth.get('email')
    $auth.unsubscribe()
    return senderEmail
  }

  return from || `noreplay@${process.env.MAIL_DOMAIN || domain || host}` // host = req.host...
}
