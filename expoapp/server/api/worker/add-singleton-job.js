import addSingletonJob from '@startupjs/worker/addSingletonJob'

export async function post (req, res) {
  const { data } = await addSingletonJob('test', { greetings: 'Hello' }, { waitForResult: true })

  res.json(data)
}
