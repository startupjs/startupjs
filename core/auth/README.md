# @startupjs/auth

User accounts for StartupJS apps: Google / Apple / GitHub login, email/password
accounts, TOTP two-factor auth and admin "login as" — **built into the framework,
nothing to install**.

## What you get out of the box

- Auth is already part of every StartupJS app. The only switch it needs is the
  `enableOAuth2` feature flag in `startupjs.config.js` — and **new projects are
  created with it already on**:

  ```js
  // startupjs.config.js
  export default {
    features: {
      enableServer: true,
      enableOAuth2: true
    }
  }
  ```

- Every visitor gets an **anonymous session automatically** (`$.session.userId`
  is always set). Logging in upgrades that session to an account.
- Sessions are JWT-based, so they work the same on web **and** native (iOS /
  Android / Expo Go) — no cookies involved. The token is stored on the device
  and attached automatically to every framework `axios` request and to the
  realtime websocket. You never touch it.
- Two collections are registered for you: `users` (public profile — name,
  avatar) and `auths` (private credentials — readable only by the account owner).

## Google login in two minutes

Providers activate automatically when their credentials exist — there is no
plugin code to write.

1. Create an OAuth client at [console.cloud.google.com](https://console.cloud.google.com/apis/credentials)
   ("OAuth client ID" → "Web application"). Add your app's callback to
   **Authorized redirect URIs** — it's always your app origin plus
   `/auth/google/callback`:
   - `https://myapp.com/auth/google/callback` (production)
   - `http://localhost:8081/auth/google/callback` (local dev)

2. Put the credentials in `.env`:

   ```
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   ```

3. Add a login button:

   ```js
   import { observer, pug } from 'startupjs'
   import { login } from 'startupjs/auth'
   import { Button } from 'startupjs-ui'

   export default observer(function Login () {
     return pug`
       Button(onPress=() => login('google')) Sign in with Google
     `
   })
   ```

That's it. `login('google')` sends the user through the OAuth dance and brings
them back logged in.

**GitHub** works exactly the same with `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`
and `login('github')`, **Apple** with `APPLE_CLIENT_ID` and `login('apple')`.
The callback path is always `/auth/<provider>/callback`.

## Who is logged in?

```js
import { observer, pug, $, useSub } from 'startupjs'

export default observer(function Profile () {
  const loggedIn = $.session.loggedIn.get()
  const userId = $.session.userId.get() // always set, even for anonymous visitors
  const $user = useSub($.users[userId])

  return pug`
    if loggedIn
      Span Hello, #{$user.name.get()}!
    else
      Span You are browsing anonymously
  `
})
```

And logging out:

```js
import { logout } from 'startupjs/auth'

await logout()
```

## Where to redirect after login

```js
await login('google', { redirectUrl: '/dashboard' })
```

Or set it once for all logins in `startupjs.config.js`:

```js
export default {
  features: { enableServer: true, enableOAuth2: true },
  plugins: {
    auth: {
      client: { redirectUrl: '/dashboard' }
    }
  }
}
```

## Email/password accounts

Unlike the OAuth providers (which are inert until you add their credentials),
email/password auth needs no credentials — so its self-service registration
endpoint is **opt-in**:

```js
// startupjs.config.js
export default {
  features: { enableServer: true, enableOAuth2: true },
  plugins: {
    auth: {
      isomorphic: { enableLocal: true }
    }
  }
}
```

Then build your forms on top of:

```js
// register (also logs the user in)
await login('local', { register: true, email, password, confirmPassword })

// login
await login('local', { email, password })
```

Passwords must be at least 8 characters with a number, a lowercase and an
uppercase letter. Errors (`throw`n by `login`) come with user-friendly messages
you can show directly in the form.

## Customizing providers

Provider configs (scopes, endpoints, profile mapping, login hooks) are
overridable through the `providers` server option:

```js
export default {
  plugins: {
    auth: {
      server: {
        providers: {
          google: {
            scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
            async afterRegister ({ userId }) {
              // e.g. seed data for a freshly created account
            }
          }
        }
      }
    }
  }
}
```

Extra scopes can also be requested per-login:
`login('google', { extraScopes: [...] })`.

## Advanced

- **Two-factor auth (TOTP)**: `login('2fa', { secret, code })` verifies a
  one-time code against a TOTP secret stored on the account.
- **"Login as" (admin impersonation)**: `login('force', { userId })`, gated by
  the `FORCE_CLIENT_SECRET` env var — disabled unless you set it.
- **Stable session secret**: sessions are signed with an auto-generated secret
  stored in the database. Set the `SESSION_SECRET` env var to pin it instead —
  useful for orchestrators and multi-instance deployments (a DB wipe/restore
  then doesn't invalidate every issued token).
- **Custom auth routes**: mint your own sessions server-side with
  `import { createToken, getSessionData } from '@startupjs/auth/server'` — e.g.
  to add custom JWT claims like `isAdmin`.
- **Custom account storage**: pass `userDBStorage` (server option) to store
  accounts somewhere other than the built-in `auths` collection.

For the full picture — how the JWT session works end to end (token minting,
websocket auth, API gating, SSO handoffs, security model) — see the
[auth architecture doc](https://github.com/startupjs/startupjs/blob/master/core/auth/jwtSession/architecture.md).
