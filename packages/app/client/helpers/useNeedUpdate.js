import { Platform } from 'react-native'
import { useDoc } from 'startupjs'

const OS = Platform.OS

export default function useNeedUpdate (criticalVersion) {
  const [, $version] = useDoc('service', 'version')
  const newOsVersion = $version.get(`criticalVersion.${OS}`)
  const currentOsVersion = criticalVersion && criticalVersion[OS]

  return currentOsVersion < newOsVersion
}
