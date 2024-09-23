import { DevSettings } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import navigate from '@startupjs/utils/navigate'
import reloadAppAsync from '@startupjs/utils/reloadAppAsync'

export const RESTORE_URL_KEY = 'startupjs.restoreUrl'

export async function reload (restoreUrl) {
  if (restoreUrl) await AsyncStorage.setItem(RESTORE_URL_KEY, restoreUrl)
  if (process.env.NODE_ENV !== 'production' && DevSettings?.reload) {
    return DevSettings.reload()
  } else if (reloadAppAsync) {
    return reloadAppAsync('Must restart on login')
  } else {
    throw Error(ERRORS.noReload)
  }
}

export async function maybeRestoreUrl () {
  const restoreUrl = await AsyncStorage.getItem(RESTORE_URL_KEY)
  if (restoreUrl) {
    await AsyncStorage.removeItem(RESTORE_URL_KEY)
    await new Promise(resolve => setTimeout(resolve, 500))
    if (navigate) {
      navigate(restoreUrl)
    } else {
      const err = Error(ERRORS.noNavigate)
      err.restoreUrl = restoreUrl
      throw err
    }
  }
}

const ERRORS = {
  noReload: `
    auth:
      No way to reload the app in a pure React Native.
      Please catch this error and restart the app manually.
  `,
  noNavigate: `
    auth:
      No way to navigate to a url in a pure React Native.
      Please catch this error and restore the url manually.
      Use the \`err.restoreUrl\` property to get the url.
  `
}
