# JWT auth architecture (`jwtSession` + `oauth2`)

This document explains how authentication and sessions work in StartupJS when
`enableOAuth2` is on — the **jwtSession** strategy (stateless JWT-in-storage) and
the **oauth2** plugin (the `login()`/`logout()` surface, provider flows, and the
`auths`/`users` account model). It covers the runtime model, what is protected
and how, the extension points, worked recipes, and the edge cases that bite.

Read this before building any custom auth route, a cross-service session handoff
(SSO), an anonymous-visitor site, or anything that needs to grant or read session
state on a jwt server. Every non-obvious behavior below was learned the hard way.

---

## 1. The two session strategies (and why jwt)

`@startupjs/auth` ships **four** session/auth plugins, all self-registering and
selected by config flags. They are mutually exclusive:

| plugin | `enabled()` condition | session lives in |
|---|---|---|
| `cookieSession` | `(enableServer\|\|enableConnection) && !enableOAuth2` | an `express-session` cookie (server-side store) |
| `jwtSession` | `(enableServer\|\|enableConnection) && enableOAuth2` | a signed JWT the **client** stores |
| `oauth2` (name `'auth'`) | same as jwtSession | — (adds the login routes + account model) |
| `offlineSession` | `!enableServer && !enableConnection && enableOffline` | client only |

`enableOAuth2` is a single build/config boolean. There is **no per-request or
per-platform mix** — you cannot run cookies on web and jwt on native in one
deployment. `jwtSession` and `oauth2` turn on together.

**Why choose jwt:** cookies are not available on native / Expo Go. jwtSession
keeps the token in `AsyncStorage` (web: `localStorage`), passes it as a `Bearer`
header on HTTP and `?token=` on the websocket, and therefore works identically on
web and native. Anonymous visitors are a first-class case (see §3).

The server wires this in `core/server/index.js`: when `enableOAuth2` is on it
does **not** create the cookie session (`_createSession` is skipped), and it
installs jwtSession's `authorizeConnection` reducer as the websocket authorizer.

---

## 2. The token: structure, secret, lifetime

A session token is a plain `jsonwebtoken` HS256 JWT (`server/createToken.js`):

```js
createToken(payload) // → jwt.sign(payload, await getAppSecret(), { algorithm: 'HS256', expiresIn: '30d' })
```

- **`payload.userId` is required** (`createToken` throws without it). Everything
  else is free-form claims: `loggedIn`, `authProviderIds`, and any custom claims
  you add (e.g. `isAdmin`, `user: { email, name }`).
- **Expiry** `TOKEN_EXPIRATION = '30d'`; **reissue window**
  `TOKEN_REISSUE_AFTER_SECONDS = 7d` (see §3).
- The client stores the WHOLE session object `{ ...claims, token }` under the key
  `startupjs.session` (`client/sessionData.js` `SESSION_KEY`).

### The app secret (`getAppSecret`)

The HS256 signing secret comes from `server/getAppSecret.js`. Resolution order:

1. **`process.env.SESSION_SECRET`** — if set, used directly. Prefer this in
   production and multi-instance / orchestrated setups: it is stable, shared
   across instances, and survives a DB wipe/restore. Wiping the DB otherwise
   **rotates the secret and invalidates every issued token** (all anon + logged-in
   sessions drop). It also sidesteps the historical multi-instance creation race
   (N instances booting against a fresh DB could each generate + race-write a
   different secret).
2. Otherwise a `service.appSecret` doc in the DB (auto-generated `uuid` on first
   use, server-only collection). Fine for a single-instance app with a persistent
   DB.

> `SESSION_SECRET` also names the cookie-session secret in `createSession.js`, but
> that path is skipped under `enableOAuth2` — under jwt the same env var pins the
> **JWT** secret.

### Server exports

`@startupjs/auth/server` exports `getAppSecret`, `createToken`, `getSessionData`
(plus `AuthStorage`, `LocalAuthStorage`). Use these to mint tokens from your own
routes — see §5 and the recipes. (`createToken`/`getSessionData` are the clean
way to add custom claims; the built-in provider routes do not expose a claims
hook — §10.)

---

## 3. Anonymous-visitor lifecycle (end to end)

Anonymous visitors are fully supported — the token endpoint is **pre-auth**.

`POST /api/auth/token` (mounted on `beforeSession`, so reachable with no token):

- **No token in the request** → mint a fresh anon identity: `userId = uuid()`,
  30-day token, return `{ userId, token }`.
- **Valid token, age ≤ 7 days** → `{ __NOT_CHANGED__: true }` (client keeps its
  stored session).
- **Valid signature but past the 7-day reissue window (or expired)** → re-verify
  with `ignoreExpiration`, strip `iat`/`exp`, re-sign the SAME payload → a fresh
  30-day token, return `{ ...session, token }`. **Same userId, same claims** —
  so an admin/logged-in token stays admin/logged-in across reissue.
- **Undecodable/invalid token** → falls through to minting a NEW anon userId.

**So a returning visitor keeps the same `userId`** as long as they return within
the 30-day signature validity; storage clear / incognito / >30-day gap yields a
new anon id (data owned by the old id is orphaned — it was never cross-device).

### Client boot order

`jwtSession`'s `renderRoot` wraps the tree in two ordered Suspense initializers:

```
TokenInitializer → ConnectionInitializer → <app>
```

1. **`TokenInitializer`** runs `initToken()` once: read stored session,
   `axios.post('/api/auth/token', { token })`, and on a changed response
   `setSessionData(session)`.
2. **`setSessionData(session)`** (`client/sessionData.js`) writes
   `startupjs.session` storage, fans every claim into the client signal
   (`for (const key in session) $.session[key].set(...)` — so `$.session.userId`,
   `$.session.loggedIn`, `$.session.user`, … all become readable), sets the axios
   default `Authorization: Bearer <token>`, and fires `onInitSession`.
3. **`ConnectionInitializer`** opens the teamplay websocket with the token
   appended: `getConnectionUrl → getDefaultConnectionUrl() + '?token=' + token`.

Because these are Suspense initializers, by the time the app renders `$.session`
is already populated — no hydration race for reading claims like `loggedIn`.

---

## 4. Server session semantics — `req.session` is IMMUTABLE

Under jwtSession, `req.session` is set by the `session` middleware to the
**verified JWT payload** — it reads the token from, in order, `?access_token`
(query), `access_token` (body), or the `Authorization: Bearer` header
(`jwtSession/plugin.js` `session` hook). If a token is present but invalid it
returns **401**; if no token is present it just continues (`req.session`
undefined).

**A route cannot durably change `req.session`.** It is a decoded token — there is
no session store to write it back. Assigning `req.session.isAdmin = true` does
nothing after the response ends.

**To grant new session state you MINT A NEW TOKEN and deliver it to the client**,
which stores it (replacing the old one) and reconnects. Two delivery channels:

- **XHR flows** (the client called you with axios and can read a JSON body):
  respond with `{ session: { ...claims, token } }`. The client calls
  `setSessionData(session)` then reloads.
- **Redirect / cross-site handoffs** (a top-level navigation with no way to read a
  JSON body or send a header — OAuth callbacks, an SSO handoff): respond with a
  tiny **bootstrap HTML page** that writes the session to storage and navigates:

  ```html
  <script>
    localStorage.setItem('startupjs.session', '<json>');
    window.location.href = '<returnTo>';
  </script>
  ```

  This is exactly what the built-in `redirectBackToApp` does on web
  (`oauth2/serverHelpers/redirect.js`); on native it instead redirects to
  `<returnTo>?__successAuthToken__=<encoded session>` and the client `login()`
  parses it. **Escape the JSON for the HTML/JS context** (`<`, `>`, `&`, U+2028/9)
  — a delivered session can carry an attacker-influenced email.

After delivery, the client reload re-runs `TokenInitializer` (posts the new stored
token → unchanged) and `ConnectionInitializer` (reconnects the websocket with the
new token). **A plain `window.location.reload()` alone does NOT upgrade anything**
— the new token must be stored (via `setSessionData` or the bootstrap page)
*before* the reload, or the websocket reconnects with the old identity.

---

## 5. The `/api` gate — what is protected

`core/server/server/createMiddleware.js` builds two Express layers:

- **`publicApp`** (always runs, no token needed) — hooks: `beforeSession`,
  `session`, `serverRoutes`. Plus, from `createExpress.js`: `logs`, `static`, and
  the hardcoded `GET /healthcheck`.
- **`protectedApp`** — hooks: `afterSession`, `middleware`, `api`, and the
  filesystem `server/api/*.js` → `/api` router.

Under `enableOAuth2` the gate is:

```js
publicApp.use((req, res, next) => {
  if (!req.session) return next()   // no valid token → SKIP protectedApp
  protectedApp(req, res, next)
})
```

Consequences — **read these before writing a route or a test:**

- **Every `server/api/*` route and every `api`-hook route needs a Bearer token.**
- **A tokenless request to a gated `/api` path is NOT a 401.** `req.session` is
  undefined → protectedApp is skipped → it falls through to `serverRoutes` and
  then the **SPA catch-all → 200 HTML**. So `fetch('/api/x').then(r => r.json())`
  without a token silently gets HTML and throws on parse. (A 401 only happens when
  a token is *present but invalid*.) Tests and health checks must account for this.
- **To keep a route reachable without a token**, mount it on a **public** hook:
  - `beforeSession` — runs *before* the `session` middleware, so `req.session`
    is not yet set. Good for: the anon-token endpoint, health/status, webhooks.
  - `serverRoutes` — runs *after* the `session` middleware and *after* the gate
    bypass, so it IS reachable without a token **and** `req.session` is populated
    when a token rides along (e.g. `?access_token`). This is the sweet spot for
    **OAuth callbacks and SSO handoffs** — they arrive as tokenless top-level
    navigations but can still read a verified session when the client passes
    `?access_token` on the initiating navigation.

Client-side, always use the framework axios (`@startupjs/utils/axios`, re-exported
as `import { axios } from 'startupjs'`). `setSessionData` sets its default Bearer
header, so every axios call is authenticated automatically. **Never use a bare
`fetch()`** for a gated route — it won't carry the header.

---

## 6. WebSocket authorization

The teamplay websocket upgrade **requires** a token: jwtSession's
`authorizeConnection` reads `?token=` from the upgrade URL and **throws if it is
missing** (the connection is rejected, not merely read-limited), else sets
`req.session = jwt.verify(token)` — which becomes the ShareDB agent session that
access-control rules see.

- The browser client appends it automatically (`getConnectionUrl`, §3).
- **A raw Node client** (`teamplay/connect`) has no built-in `token` option, but
  `connect` forwards a `getConnectionUrl` through to the socket, so you pass it
  yourself (recipe in §7). First obtain a token via `POST /api/auth/token`.
- **Sending the token as a `?token=` query param is safe** because production is
  HTTPS-only — the query string is encrypted in transit and never logged by
  intermediaries on the wire. (Do keep it out of app-level access logs.)

---

## 7. The `oauth2` plugin — providers, accounts, delivery

Turning on `enableOAuth2` also enables the `oauth2` plugin (registered under the
name `'auth'`), which adds the login surface and the account model.

### Routes (all on `beforeSession` except force-login on `afterSession`)

| method | path | purpose |
|---|---|---|
| POST | `/auth/getUrl` | returns the provider's authorize URL |
| POST | `/auth/local/register` | email/password register (bcrypt). **Opt-in** — mounted only with the `enableLocal: true` isomorphic plugin option |
| POST | `/auth/local/login` | email/password login (same `enableLocal` gate) |
| POST | `/auth/apple/callback` | Apple `form_post` callback |
| GET | `/auth/:provider/callback` | Google/GitHub/… OAuth code callback |
| POST | `/auth/2fa/login` | TOTP second factor |
| GET | `/auth/finish` | static "Authenticated successfully" **stub** (does NOT deliver a token — don't rely on it) |
| POST | `/auth/force/login` | "login as" (admin impersonation) |

### Account model (`isomorphic.models`)

Two collections, both keyed by the account `userId`:

- **`auths`** — `{ email, createdAt, providerIds[] }` + a per-provider sub-doc
  `{ id, email, name, avatarUrl, raw }`. For `local`, the **bcrypt password hash
  is stored at `auth.local.token`**. Access: read only your own doc
  (`session.userId === docId`).
- **`users`** — public profile `{ name, avatarUrl, createdAt }`. Access: read all,
  update your own.

All account writes happen server-side (they bypass access control). Storage is
`LocalAuthStorage` (override with the `userDBStorage` server option).

### Token minting + delivery (built-in)

- **Local/force/2fa (JSON flows):** the route returns `{ session }`
  (`getSessionData(userId, { extraPayload, storage })` builds
  `{ userId, loggedIn: true, authProviderIds, ...extraPayload }` + token). The
  client `localLogin` calls `setSessionData(session, { silent: true })` then hard
  redirects.
- **OAuth providers (google, …):** `redirectBackToApp(res, session, state)` —
  web writes `localStorage` inline + redirects; native redirects with
  `?__successAuthToken__=`. The client `login()` handles both.

### Account resolution (`getOrCreateAuth`)

On any provider login: (1) match by `(provider, providerUserId)`; else (2) if
`config.allowAutoMergeByEmail` and the email is provider-verified, merge the
provider into an existing same-email account; else (3) create a new account.
Config hooks: `getPrivateInfo`/`getPublicInfo`/`autoUpdateInfo`/`saveRawUserinfo`,
plus `beforeLogin({ $auth, config, provider, userId })` and
`afterRegister({ $auth, config, provider, userId, state })`.

### Provider credentials

`GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (and the analogous per-provider env
vars) are read by `serverHelpers/providers.js`. The redirect URI is derived from
the request `Host`: `{proto}://{host}/auth/{provider}/callback` — register that in
the provider console. Endpoints/scopes are overridable via a `providers` server
option (useful for a fake OAuth server in tests).

---

## 8. `login()` / `logout()` (client)

`import { login, logout } from '@startupjs/auth/client'` (or `'startupjs/auth'`).

- `login('local', { email, password, register?, redirectUrl })` → POSTs
  local/register|login, stores the returned session, hard-redirects. Requires the
  `enableLocal: true` isomorphic plugin option
  (`plugins: { auth: { isomorphic: { enableLocal: true } } }`) — every other
  provider is gated by its own credentials (`GOOGLE_CLIENT_SECRET`,
  `FORCE_CLIENT_SECRET`, …); `local` needs none, so self-service registration
  must be explicitly opted into instead of being an always-on route.
- `login('google', { redirectUrl })` → POSTs `/auth/getUrl`, navigates to the
  provider with a `state` carrying `{ platform, redirectUrl, scopes }`.
- `login('force', { userId })` → admin impersonation.
- `logout()` → `deleteSessionData()` then a full reload (web) / app reload
  (native). There is **no server logout route** — dropping the token is logout.
  (If you need logout to also mint a fresh *anonymous* token immediately, do it in
  a custom route and `setSessionData` the result before reload.)

---

## 9. Recipes

### 9.1 Custom login route that mints a token with custom claims

```js
import { getAppSecret, createToken } from '@startupjs/auth/server'

export const post = async (req, res) => {
  // ...verify credentials...
  const userId = req.session?.userId ?? crypto.randomUUID() // keep the caller's id, or fresh
  const token = await createToken({ userId, isAdmin: true, user: { email } })
  res.json({ ok: true, session: { userId, isAdmin: true, user: { email }, token } })
}
```

Client:

```js
import { axios } from 'startupjs'
import { setSessionData } from 'startupjs/auth'

const { data } = await axios.post('/api/admin-login', { password })
if (data.session) await setSessionData(data.session)
window.location.reload() // reconnect the ws with the new identity
```

### 9.2 A public / pre-auth route (health, webhook, SSO handoff)

Mount on `beforeSession` (no session needed) or `serverRoutes` (reachable
tokenless AND gets `req.session` when a token rides along). A filesystem
`server/api/*.js` route is ALWAYS gated — move handoff/redirect endpoints to a
`serverRoutes` hook instead.

```js
server: () => ({
  serverRoutes (publicApp) {
    publicApp.get('/api/sso', async (req, res) => { /* verify handoff → mint → deliver */ })
  }
})
```

### 9.3 Deliver a session on a redirect (bootstrap page)

```js
function deliverSession (res, payload, returnTo = '/') {
  const session = { ...payload, token: await createToken(payload) }
  res.setHeader('Content-Type', 'text/html')
  res.send(
    `<!doctype html><meta charset="utf-8"><script>` +
    `localStorage.setItem('startupjs.session', ${escapeForHtml(JSON.stringify(session))});` +
    `location.replace(${escapeForHtml(safePath(returnTo))});</script>`
  )
}
```

### 9.4 Anonymous → account data adoption (safely)

When an anon visitor logs in, re-parent the data they owned (so a guest cart
survives sign-in). **The anonymous `userId` MUST come from a verified source** —
`req.session.userId` (the caller's Bearer token) or a value you signed yourself —
**never a raw query param**, or a hostile client could claim another visitor's id
and steal their docs. For a redirect flow, have the client pass its current token
as `?access_token` on the initiating navigation so the server reads the verified
anon id off `req.session`, then thread it through **signed** OAuth `state`. For a
cross-service handoff (the other service can't share your account state), sign a
small `{ anonUserId, exp }` blob with `getAppSecret()`, hand it over opaquely, and
verify it on return.

### 9.5 Connect a Node client (seeder/test) with a token

```js
import connect from 'teamplay/connect'
const { token } = await (await fetch(`${baseUrl}/api/auth/token`, {
  method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}'
})).json()
connect({
  baseUrl,
  getConnectionUrl: ({ getDefaultConnectionUrl }) => `${getDefaultConnectionUrl()}?token=${token}`
})
// and for HTTP seeding, set the Authorization: Bearer <token> header yourself.
```

### 9.6 Pin the app secret across instances / DB wipes

Set `SESSION_SECRET` in the environment of every instance (see §2). Tokens then
survive restarts, DB restores, and are valid across a horizontally-scaled fleet.

---

## 10. Edge cases & gotchas

- **`req.session` is read-only.** Mutating it never persists — mint a token (§4).
- **Tokenless gated `/api` → SPA HTML (200), not 401.** Parsing it as JSON fails
  silently. Only a *present-but-invalid* token yields 401. This changes how you
  write both routes and tests (mint an anon token in tests; discriminate
  "endpoint served" from "fell through to SPA" by whether an *authenticated* call
  returns the expected JSON, not by content-type).
- **No client 401 auto-remint.** If a token goes invalid mid-session (e.g. crosses
  the 30-day boundary, or the app secret rotated), requests 401 until the next
  full app boot re-runs `TokenInitializer`. There is no axios interceptor that
  re-mints and retries. (Marked `// TODO` in `initToken`.)
- **Built-in provider routes don't inject custom claims.** `getSessionData`
  accepts `extraPayload`, but `local/login`, `register`, the provider callback and
  2fa call it without one — there is no per-provider config hook to add
  `isAdmin`-style claims. Add a custom route (§9.1) or extend those call sites.
- **`createToken` requires `userId`.** Always include it in the payload.
- **App-secret rotation on DB wipe** (when not env-pinned) invalidates all tokens.
  See §2 — pin `SESSION_SECRET`.
- **The websocket rejects tokenless upgrades** by *throwing* — a Node client that
  connects without a token never opens the socket (it doesn't merely get denied
  ops). Always mint + pass `?token=`.
- **`enabledProviderIds` is currently a no-op** (`isomorphic` TODO): the `local`
  (email/password) routes are ALWAYS mounted. To disable them in production, block
  the route yourself in an earlier hook (e.g. `logs`/`beforeSession`).
- **`/auth/finish` is a stub** that returns a string — it does not deliver a
  token. Token delivery is `redirectBackToApp` (§7) / the JSON flows.
- **Mutual exclusivity.** cookieSession/jwtSession/offlineSession/oauth2 select on
  the same flags — you can't run two session strategies at once.
- **`$.session` is a client-local signal tree.** Under jwt its `userId`/`token`/
  claim values originate from the JWT (via `setSessionData`), but you can still
  write your own scratch fields onto `$.session` client-side — they simply aren't
  part of the token and don't reach the server session.
