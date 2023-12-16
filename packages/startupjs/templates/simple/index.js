import { AppRegistry } from 'react-native'
import dummy from './startupjs.config' // has to be before Root import
import Root from './Root'
import { name as appName } from './app.json'

;(() => {})(dummy) // to prevent dead code elimination

AppRegistry.registerComponent(appName, () => Root)
