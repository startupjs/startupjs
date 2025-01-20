export default async function test ({ greetings }, { job }) {
  await _test(job.id)
  return greetings
}

function _test (jobId) {
  console.log('test job execution started', jobId)
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('test job executed successfully', jobId)
      resolve()
    }, 5000)
  })
}
