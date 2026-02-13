const runsByUser = {}

export default async function integrationSingletonByUser ({ userId }) {
  runsByUser[userId] = (runsByUser[userId] || 0) + 1
  await wait(40)

  return {
    userId,
    runId: runsByUser[userId]
  }
}

export const singleton = ({ userId }) => ({ userId })

function wait (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
