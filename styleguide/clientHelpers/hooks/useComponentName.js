import { $root } from 'startupjs'
import useLocalWithDefault from './useLocalWithDefault'
import { Platform } from 'react-native'
import * as COMPONENTS from 'ui'
const IS_WEB = Platform.OS === 'web'
const PATH = '_session.Props.activeComponent'

export default function useComponentName () {
  const [componentName, $componentName] =
    useLocalWithDefault(PATH, getComponentName() || Object.keys(COMPONENTS)[0])

  const setComponentName = (name) => {
    goTo(name)
    $componentName.set(name)
  }

  return [componentName, setComponentName]
}

function getComponentName () {
  if (!IS_WEB) return
  return window
    .location
    .search
    .replace(/.*[?&]componentName=/, '').replace(/&.+/, '')
}

function goTo (componentName) {
  if (IS_WEB) {
    window
      .history
      .pushState(undefined, undefined, `?componentName=${componentName}`)
  }
  $root.set(PATH, componentName)
}
