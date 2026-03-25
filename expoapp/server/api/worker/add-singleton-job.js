import runJob from '@startupjs/worker'

export async function post (req, res) {
  const data = await runJob('test', { greetings: 'Hello' })
  res.json(data)
}
