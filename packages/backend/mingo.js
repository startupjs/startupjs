import ShareDbMingoMemory from 'sharedb-mingo-memory'
import sqlite3 from 'sqlite3'
import path from 'path'

import { loadDataToMingo } from './helpers.js'

const { DB_LOAD_SNAPSHOT } = process.env
const db = new ShareDbMingoMemory()

if (DB_LOAD_SNAPSHOT) {
  const snapshotPath = path.join(process.cwd(), DB_LOAD_SNAPSHOT)
  const sqliteDb = new sqlite3.Database(snapshotPath)
  await loadDataToMingo(sqliteDb, db)
}

export default db
