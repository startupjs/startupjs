import { getScope } from '../helpers'

export const $dialog = getScope('dialog')
export const dialogOpen = options => $dialog.set({ visible: true, ...options })
