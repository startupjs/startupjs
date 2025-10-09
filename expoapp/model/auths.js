import { accessControl } from 'startupjs'

export const access = accessControl({
  read: ({ session, docId }) => session.userId === docId
})
