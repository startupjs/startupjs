// IMPORTANT: './lib/_reloadAppAsync' is intentionally without extension!
//            so that on Expo it will be resolved to './_reloadAppAsync.expo.js'
//            (our metro-config has an extra 'expo.js' extensions in resolver.sourceExts
//            which takes precedence over '.js')
export { default } from './lib/_reloadAppAsync'
