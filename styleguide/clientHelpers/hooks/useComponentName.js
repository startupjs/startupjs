import { $root, useSession, useSyncEffect } from 'startupjs'
import { Platform } from 'react-native'
import * as COMPONENTS from 'ui'
const isWeb = Platform.OS === 'web'

export default function useComponentName (defaultComponentName) {
  const [componentName, $componentName] = useSession('Props.activeComponent')

  const setComponentName = (name) => {
    goTo(name)
    $componentName.set(name)
  }

  useSyncEffect(() => {
    if (componentName) return
    const name = getComponentName() || Object.keys(COMPONENTS)[0]
    throw $componentName.setAsync('', name)
  }, [])

  return [componentName, setComponentName]
}

function getComponentName () {
  if (!isWeb) return
  return window
    .location
    .search
    .replace(/.*[?&]componentName=/, '').replace(/&.+/, '')
}

function goTo (componentName) {
  if (isWeb) {
    window
      .history
      .pushState(undefined, undefined, `?componentName=${componentName}`)
  }
  $root.set('_session.Props.activeComponent', componentName)
}
