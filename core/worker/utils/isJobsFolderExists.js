import { existsSync } from 'fs'
import { join } from 'path'

export default function isJobsFolderExists () {
  return existsSync(join(process.cwd(), 'workerJobs'))
}
