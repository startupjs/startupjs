import { Platform } from 'react-native'
import { deleteSessionData } from 'startupjs'
import { getPlugin } from '@startupjs/registry'
import { AUTH_PLUGIN_NAME } from './constants.js'

export default async function logout () {
  const plugin = getPlugin(AUTH_PLUGIN_NAME)
  if (!plugin.initialized) {
    throw new Error(`Plugin ${AUTH_PLUGIN_NAME} hasn't been initialized`)
  }
  await deleteSessionData()
  if (Platform.OS === 'web') {
    // reload the page to clear the session
    window.location.reload()
    await new Promise(resolve => setTimeout(resolve, 10000))
    return
  }
  console.error('>>> logout on mobile is not fully implemented. Have to reload the app')
  // TODO: implement logout for mobile - get a new anonymous token and force a full app re-render
}
