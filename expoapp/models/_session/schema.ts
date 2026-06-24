import { defineSchema } from 'startupjs'

const schema = defineSchema({
  banner: {
    type: 'object',
    properties: {
      visible: { type: 'boolean' }
    }
  },
  serverHello: { type: 'string' }
})

export default schema
