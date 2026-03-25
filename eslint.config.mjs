import { defineConfig } from 'eslint/config'
import neostandard, { resolveIgnoresFromGitignore } from 'neostandard'
import expoConfig from 'eslint-config-expo/flat.js'
import cssxjs from 'eslint-plugin-cssxjs'

export default defineConfig([
  ...neostandard({
    ignores: resolveIgnoresFromGitignore(),
    ts: true
  }),
  expoConfig,
  {
    plugins: {
      cssxjs
    },
    processor: 'cssxjs/react-pug'
  },
  {
    ignores: [
      'outdated/*', 'node_modules/*', 'dist/*', 'styleguide/*',
      'expoapp/.expo', 'expoapp/dist/*', 'expoapp/expo-env.d.ts',
      // outdated libraries which are not yet supported by new startupjs but kept for now for backward compatibility
      'libraries/2fa/*',
      'libraries/2fa-manager/*',
      'libraries/2fa-push-notification-provider/*',
      'libraries/2fa-totp-authentication/*',
      'libraries/2fa-totp-authentication-provider/*',
      'libraries/auth/*',
      'libraries/auth-apple/*',
      'libraries/auth-azuread/*',
      'libraries/auth-common/*',
      'libraries/auth-facebook/*',
      'libraries/auth-google/*',
      'libraries/auth-idg/*',
      'libraries/auth-linkedin/*',
      'libraries/auth-local/*',
      'libraries/auth-lti/*',
      'libraries/auth-telegram/*',
      'libraries/babel-plugin-import-to-react-lazy/*',
      'libraries/babel-plugin-ts-interface-to-json-schema/*',
      'libraries/cron/*',
      'libraries/i18n/*',
      'libraries/mailgun/*',
      'libraries/push-notifications/*',
      'libraries/recaptcha/*',
      'libraries/scrollable-anchors/*',
      'libraries/serve-static-promo/*'
    ],
  }
])
