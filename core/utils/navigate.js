// IMPORTANT: this re-export is intentionally without extension!
//            so that on Expo it will be resolved to '*.expo.js'
//            (our metro-config has an extra 'expo.js' extensions in resolver.sourceExts
//            which takes precedence over '.js')
export { default } from './lib/_navigate'
