import 'teamplay'

declare module 'teamplay' {
  interface TeamplayPluginPrivateCollections {
    startupjsOfflineSession: {
      _session: {
        userId: string
        token?: string
      }
    }
  }
}

declare const plugin: unknown
export default plugin
