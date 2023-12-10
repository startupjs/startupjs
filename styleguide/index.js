import 'text-encoding-polyfill'
import { AppRegistry } from 'react-native'
import './startupjs.config' // has to be before Root import
import Root from './Root'
import { name as appName } from './app.json'

AppRegistry.registerComponent(appName, () => Root)
