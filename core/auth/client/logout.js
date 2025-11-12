import { DevSettings, Platform } from 'react-native'
import { getPlugin } from '@startupjs/registry'
import reloadAppAsync from '@startupjs/utils/reloadAppAsync'
import { AUTH_PLUGIN_NAME } from './constants.js'
import { deleteSessionData } from './sessionData.js'

export default async function logout () {
  const plugin = getPlugin(AUTH_PLUGIN_NAME)
  if (!plugin.enabled) {
    throw new Error(`Plugin ${AUTH_PLUGIN_NAME} hasn't been enabled`)
  }
  await deleteSessionData()
  if (Platform.OS === 'web') {
    // reload the page to clear the session
    window.location.reload()
    await new Promise(resolve => setTimeout(resolve, 10000))
  } else if (process.env.NODE_ENV !== 'production' && DevSettings?.reload) {
    await new Promise(resolve => setTimeout(resolve, 500))
    try { return DevSettings.reload() } catch (err) {}
  } else if (reloadAppAsync) {
    await new Promise(resolve => setTimeout(resolve, 500))
    try { return reloadAppAsync('Logged out. Requires restart') } catch (err) {}
  } else {
    throw Error(`
      logout is not fully supported on a pure React Native app.
      Please catch this error and do a full app restart manually.
    `)
  }
}
