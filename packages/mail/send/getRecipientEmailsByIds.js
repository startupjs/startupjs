export default async function getRecipientEmailsByIds (model, recipientIds) {
  if (!recipientIds) return []
  const $$auths = model.query('auths', { _id: { $in: recipientIds } })
  await $$auths.subscribe()
  const auths = $$auths.get()
  const emails = auths.map(auth => auth.email)
  $$auths.unsubscribe()
  return emails
}
