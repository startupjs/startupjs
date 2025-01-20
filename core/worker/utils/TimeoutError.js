export default class TimeoutError extends Error {
  constructor ({ jobId, jobType, jobTimeout }) {
    const message = `Job timeout reached - ${jobTimeout}ms, jobId: ${jobId}, jobType: ${jobType}`
    super(message)
    this.type = 'timeoutError'
  }
}
