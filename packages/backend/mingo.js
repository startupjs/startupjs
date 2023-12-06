import ShareDbMingoMemory from 'sharedb-mingo-memory'
import path from 'path'

import { createSqlDb, loadDataToMingo } from './helpers.js'

const { DB_LOAD_SNAPSHOT } = process.env
const db = new ShareDbMingoMemory()

if (DB_LOAD_SNAPSHOT) {
  const snapshotPath = path.join(process.cwd(), DB_LOAD_SNAPSHOT)
  const sqliteDb = await createSqlDb(snapshotPath)
  await loadDataToMingo(sqliteDb, db)
}

export default db
