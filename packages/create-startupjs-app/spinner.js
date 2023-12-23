import ora from 'ora'

export default async function showSpinner (message, promise) {
  const spinner = ora(message).start()

  try {
    await promise
    spinner.succeed()
  } catch (e) {
    spinner.fail()
    throw e
  }
}
