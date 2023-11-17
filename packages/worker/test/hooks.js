import './defaults.js'
import { getDbs } from './../db.js'

after(async () => {
  const { shareDbMongo } = await getDbs({ secure: false })
  shareDbMongo.close()
})
