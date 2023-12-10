import { createProject } from 'startupjs/registry'
import serveStaticPromo from '@startupjs/serve-static-promo/plugin.js'

export default createProject({
  plugins: {
    [serveStaticPromo]: {
      client: {
        redirectUrl: '/promo',
        testClient: 'hello client'
      },
      server: {
        testServer: 'hello server'
      },
      build: {
        testBuild: 'hello build'
      },
      isomorphic: {
        testIsomorphic: 'hello isomorphic'
      }
    }
  }
})
