const dotenv = require('dotenv')

dotenv.config({ path: [`.env.${process.env.STAGE || 'local'}`, '.env'] })

module.exports = () => {}
