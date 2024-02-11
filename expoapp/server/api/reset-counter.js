export async function post (req, res) {
  const { model: $root } = req
  const $count = $root.at('testCounts.magicCount1')
  await $count.subscribe()
  await $count.reset()
  res.json(true)
}
