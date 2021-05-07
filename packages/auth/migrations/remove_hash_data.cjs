module.exports = async function (model) {
  const $users = model.query('users', {
    $or: [
      { password: { $exists: true } },
      { hash: { $exists: true } },
      { salt: { $exists: true } }
    ]
  })
  await $users.fetch()

  for (const user of $users.get()) {
    await model.del(`users.${user.id}.password`)
    await model.del(`users.${user.id}.hash`)
    await model.del(`users.${user.id}.salt`)
  }
}
