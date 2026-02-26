import runJob from '@startupjs/worker'

export async function post (req, res) {
  const { numbers } = req.body
  try {
    const highestNumber = await runJob('highestNumber', numbers)
    return res.json(highestNumber)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}
