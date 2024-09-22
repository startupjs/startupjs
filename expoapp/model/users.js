import { accessControl } from 'startupjs'

export const access = accessControl({
  read: true,
  update: ({ session, docId }) => {
    return session.userId === docId
  }
})
