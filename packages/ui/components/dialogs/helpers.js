import { getPageUI } from '../../helpers'

export const $dialog = getPageUI('dialog')
export const openDialog = options => {
  $dialog.set({ visible: true, ...options })
}
