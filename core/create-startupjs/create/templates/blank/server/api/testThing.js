export default async (req, res) => {
  const { model } = req
  const $testThing = model.at('testThings.first')
  await $testThing.subscribe()
  res.json({ name: 'Test API', testThing: $testThing.get() })
}
