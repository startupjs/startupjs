import type {
  CollectionSpec,
  TeamplayFeature
} from 'teamplay'
import 'teamplay'

type EmptyObject = Record<never, never>

interface AuthDoc {
  email?: string
  createdAt: number
  [providerId: string]: unknown
}

interface UserDoc {
  name?: string
  avatarUrl?: string
  createdAt: number
}

type OAuth2Collections = TeamplayFeature<'enableOAuth2'> extends true
  ? {
      auths: CollectionSpec<AuthDoc>
      users: CollectionSpec<UserDoc>
    }
  : EmptyObject

type OAuth2Session = TeamplayFeature<'enableOAuth2'> extends true
  ? {
      _session: {
        loggedIn?: boolean
        authProviderIds?: string[]
        token?: string
      }
    }
  : EmptyObject

declare module 'teamplay' {
  interface TeamplayPluginCollections {
    startupjsOAuth2: OAuth2Collections
  }

  interface TeamplayPluginPrivateCollections {
    startupjsOAuth2: OAuth2Session
  }
}

declare const plugin: unknown
export default plugin
