import { $, sub } from 'startupjs'

export async function post (req, res) {
  const $count = await sub($.testCounts.magicCount1)
  await $count.reset()
  res.json(true)
}
