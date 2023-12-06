import ShareDbMingoMemory from 'sharedb-mingo-memory'
import path from 'path'
import { cloneSqlDb, createSqlDb, loadDataToMingo, patchMingoCommit } from './helpers.js'

const { DB_PATH, DB_LOAD_SNAPSHOT } = process.env

const db = new ShareDbMingoMemory()
const sourcePath = DB_LOAD_SNAPSHOT || DB_PATH || 'sqlite.db'
let sqlDb = await createSqlDb(path.join(process.cwd(), sourcePath))

await loadDataToMingo(sqlDb, db)

if (DB_PATH && DB_PATH !== sourcePath) {
  const sourceDb = sqlDb
  sqlDb = await createSqlDb(path.join(process.cwd(), DB_PATH || 'sqlite.db'))

  await cloneSqlDb(sourceDb, sqlDb)
}

patchMingoCommit(sqlDb, db)

export default db
