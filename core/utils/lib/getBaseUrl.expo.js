import Constants from 'expo-constants'

const EXPO_DEFAULT_PORT = 8081
const DEFAULT_BASE_URL = `http://localhost:${EXPO_DEFAULT_PORT}`

export default function getBaseUrl () {
  let url
  url ??= getExplicitBaseUrl()
  if (typeof window !== 'undefined') url ??= window.location?.origin
  try {
    url ??= Constants.linkingUri
  } catch (err) {}
  url ??= DEFAULT_BASE_URL
  if (/^exps?:/.test(url)) {
    url = url.replace(/^exp/, 'http')
    url = url.replace(/\/--\/$/, '')
  } else if (!/^https?:/.test(url)) {
    url = DEFAULT_BASE_URL
  }
  url = url.replace(/\/+$/, '')
  return url
}

// Explicitly specifying baseUrl is only required for the production builds of ios and android.
//
// In order to specify the explicit baseUrl, you have to make sure EXPO_PUBLIC_BASE_URL
// env variable is set in your environment during the build time.
//
// For production builds it means you'll run the following commands:
// - android:
//     EXPO_PUBLIC_BASE_URL=https://myapp.com npx expo run:android --variant release
// - ios:
//     EXPO_PUBLIC_BASE_URL=https://myapp.com npx expo run:ios --configuration Release
//
// IMPORTANT:
//   The production build commands above for android and ios are NOT automatically
//   code signed for submission to the Google Play Store and Apple App Store.
//   They are just for the local testing of the production build.
//   To generate an actual production build for submission to the app stores,
//   refer to the Expo documentation and use tools like EAS Build or Fastlane or alternatives.
//
// For web you would not usually need to set an explicit baseUrl, because it's automatically
// determined from the window.location.origin.
//
// However, if you have a custom microservice which serves the web build or it's served from a CDN,
// then you can also explicitly set the EXPO_PUBLIC_BASE_URL env variable for the web build:
// - web:
//     EXPO_PUBLIC_BASE_URL=https://myapp.com yarn build
//
// IMPORTANT:
//   If you specify an explicit baseUrl (which is a backend API url) for the web build
//   and it's a different domain from where your webapp is actually served from,
//   then you should also set correct CORS headers on the backend API server.
//   Otherwise the backend API server will reject any requests from a different domain.
//
//   Simplest way to enable all CORS requests is using the `cors` npm package
//   in the startupjs.config.js like this:
//
//   import cors from 'cors'
//   export default {
//     server: {
//       init () {
//         this.on('beforeSession', expressApp => expressApp.use(cors()))
//       }
//     }
//   }
//
function getExplicitBaseUrl () {
  return process.env.EXPO_PUBLIC_BASE_URL
}
