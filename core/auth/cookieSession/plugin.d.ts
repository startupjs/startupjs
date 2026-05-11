import 'teamplay'

declare module 'teamplay' {
  interface TeamplayPluginPrivateCollections {
    startupjsCookieSession: {
      _session: {
        userId: string
        loggedIn?: boolean
      }
    }
  }
}

declare const plugin: unknown
export default plugin
