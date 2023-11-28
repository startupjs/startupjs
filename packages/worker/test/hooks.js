import './defaults.js'
import { getDbs } from './../db.js'

after(async () => {
  const { backend } = await getDbs({ secure: false })
  backend.db.close()
})
