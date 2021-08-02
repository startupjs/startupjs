import { getScope } from '../path'

export const $dialog = getScope('dialog')
export const dialogOpen = options => $dialog.set({ visible: true, ...options })
