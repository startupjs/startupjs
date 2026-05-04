# StartupJS E2E Guide

This guide describes a practical pattern for setting up end-to-end testing for StartupJS apps with Playwright. It is intended to be reusable across StartupJS projects.

## Goals

- test the app the way users actually run it
- isolate E2E data from the developer's normal local database
- keep the setup deterministic enough for agents to extend safely
- keep selectors readable enough that a human would naturally write the same ones
- treat accessibility and E2E friendliness as the same quality bar

## Preferred Server Strategy

For StartupJS apps, prefer a production-backed Playwright server over Metro/dev-server-backed E2E:

1. `yarn build`
2. `yarn start-production`

Why:
- it is more deterministic than a long-running Metro dev session
- build completion is explicit
- it tests the production bundle instead of development-only behavior
- Playwright `webServer` integration works cleanly with it

Use Metro/dev mode only when you specifically need hot-reload iteration or a failure reproduces only there.

## Database Isolation

StartupJS apps using Teamplay backend can switch to SQLite-backed Mingo mode with environment variables from `@teamplay/backend`.

Important variables:
- `NO_MONGO=true`
- `DB_PATH=/path/to/e2e.db`
- `DB_LOAD_SNAPSHOT=/path/to/seed.db` if you want to clone a known fixture DB
- `DB_READONLY=true` only when you explicitly want non-persistent server state

Typical isolated boot:

```bash
mkdir -p .playwright
rm -f .playwright/e2e.db
NO_MONGO=true DB_PATH=.playwright/e2e.db yarn start-production
```

Fixture-based boot:

```bash
mkdir -p .playwright
rm -f .playwright/e2e.db
NO_MONGO=true DB_LOAD_SNAPSHOT=.playwright/seed.db DB_PATH=.playwright/e2e.db yarn start-production
```

This keeps test data separate from the app's normal local database.

## Generated Artifact Hygiene

A typical StartupJS + Playwright repo should ignore generated artifacts such as:

- `.playwright/`
- `test-results/`
- `playwright-report/`

If the repo runs `npx eslint .`, generated files may also need ESLint ignores.

## Playwright Setup

Install Playwright in the workspace:

```bash
yarn add -D playwright
npx playwright install chromium
```

A good baseline `playwright.config.ts` for StartupJS:

```ts
import { defineConfig, devices } from 'playwright/test'

const baseURL = 'http://127.0.0.1:3000'

export default defineConfig({
  testDir: './tests',
  workers: 1,
  fullyParallel: false,
  timeout: 120_000,
  expect: { timeout: 20_000 },
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  webServer: {
    command: 'mkdir -p .playwright && rm -f .playwright/e2e.db && yarn build && PORT=3000 NO_MONGO=true DB_PATH=.playwright/e2e.db yarn start-production',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    stdout: 'pipe',
    stderr: 'pipe'
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1600, height: 900 }
      }
    }
  ]
})
```

## Test Design Guidelines

### 1. Cover real workflows first

Start with the important business flows before edge cases:
- entry/authentication flow
- core CRUD flow
- state transitions
- readback/results screens
- one or two failure states

### 2. Prefer UI setup and UI assertions

Use the UI to perform meaningful user actions.

Prefer user-visible assertions over DB assertions:
- if something is deleted, confirm it disappears from the UI
- if navigation happens, confirm the visible route or screen changed
- if a result is computed, assert the result screen content

DB readback is a fallback, not the default. Use it only when the UI does not expose a stable visible signal yet.

### 3. Keep tests serial unless proven safe

StartupJS apps with a shared test database and realtime state are usually easiest to stabilize with:
- `workers: 1`
- `fullyParallel: false`
- serial suites when state is shared

Parallelize only after isolation is strong enough.

### 4. Prefer the simplest semantic selectors

Prefer:
- `page.getByLabel(...)`
- `page.getByRole('button' | 'link' | 'tab' | 'dialog' | 'heading', { name: ... })`
- `selectOption({ label: ... })`
- URL and route assertions
- visible text assertions for content, not for locating controls

Avoid:
- generated class names
- CSS/XPath selectors
- DOM depth assumptions
- text-node clicks on interactive controls
- timing-only waits

The target is that a test reads the way a human would describe the interaction.

If that does not work, first ask:
1. Is the control missing an accessible name?
2. Is the control missing the correct role?
3. Is the label relationship broken?
4. Is the control's visible text ambiguous?
5. Is the UI-library component failing to expose normal semantics?

Usually the correct fix is in the app or shared UI library, not in the test.

### Accessibility is part of the E2E contract

Treat E2E friendliness and accessibility as the same concern:
- if a user can understand and activate a control, Playwright should usually be able to locate it semantically
- if Playwright needs brittle selectors, the UI is often also under-accessible
- adding proper labels, roles, and states improves both assistive technology support and E2E maintainability

That means:
- prefer adding `aria-label`, `role`, and other semantic props in app code
- avoid burying the problem under `locator('xpath=...')`, `.nth(...)`, or DOM-shape selectors unless no realistic semantic alternative exists

### When the problem is in a shared UI library

If the selector problem appears to come from a shared UI component library:
- confirm whether the app is using the component correctly
- if the issue is really in the library, explain the limitation clearly
- suggest the concrete library change that would make the component accessible and E2E-friendly

Examples:
- wrapped inputs are not reachable by label
- icon-only buttons do not expose a usable accessible name
- dialogs do not expose proper dialog semantics
- tabs/selects/rows do not expose stable roles or state

In a normal app repo, do not assume you should patch the library directly. Document the limitation and explain how it affects Playwright selectors.

### When `exact: true` is appropriate

Do not use `exact: true` by default.

Use it only when accessible names are genuinely ambiguous for substring matching. If the simpler locator works naturally, prefer the simpler version.

### 5. Use explicit polling for backend-driven state

Prefer:

```ts
await expect.poll(() => readThingFromDb()).not.toBeNull()
```

instead of:

```ts
await page.waitForTimeout(2000)
```

When possible, poll user-visible state before polling the DB.

## Recommended Verification Loop

When changing StartupJS code, run checks in this order:

1. `npx startupjs check`
2. `npx eslint .`
3. `npx playwright test`
4. manual smoke check if the change is user-facing or visually sensitive

Why:
- `startupjs check` catches TypeScript issues with pug support
- ESLint catches code-shape regressions
- Playwright catches behavioral regressions
- manual smoke checks catch visual and integration issues automation may miss

## Manual QA Guidelines

When manual QA is needed:
- start the app with the real command you want confidence in
- use `yarn start -c` for development smoke checks
- use `yarn build && yarn start-production` for production behavior
- use an isolated SQLite DB if the session should not pollute local development data

For browser QA with Playwright:
- prefer a persistent session
- keep a short QA inventory
- verify both desktop and mobile if layout matters
- inspect invalid/error states as well as the happy path
