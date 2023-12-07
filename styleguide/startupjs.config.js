import { createProject } from 'startupjs/registry'

export default createProject({
  plugins: {
    'serve-static-promo': {
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
