import ShareDbMingoMemory from 'sharedb-mingo-memory'
import path from 'path'

import { createSqlDb, loadDataToMingo } from './helpers.js'

const { DB_LOAD_SNAPSHOT } = process.env
const db = new ShareDbMingoMemory()

if (DB_LOAD_SNAPSHOT) {
  const snapshotPath = path.join(process.cwd(), DB_LOAD_SNAPSHOT)
  const sqlDb = await createSqlDb(snapshotPath)
  await loadDataToMingo(sqlDb, db)
}

export default db
