export let updateDialogState

export const setUpdateDialogState = fn => {
  updateDialogState = fn
}

export const openDialog = options => {
  if (!updateDialogState) {
    throw Error(`
      [@startupjs/ui] dialogs: DialogsProvider is not found.
      You have probably forgot to put StartupjsProvider in your app.
    `)
  }
  updateDialogState({ visible: true, ...options })
}
