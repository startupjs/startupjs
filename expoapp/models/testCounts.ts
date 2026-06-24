import { accessControl } from 'startupjs'

export const access = accessControl({
  create: true,
  read: true,
  update: true
})
