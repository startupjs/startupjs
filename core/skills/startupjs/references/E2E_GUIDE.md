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

Install the Playwright test runner in the app workspace:

```bash
yarn add -D playwright
yarn playwright install chromium
```

A good baseline `playwright.config.ts` for StartupJS:

```js
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
        viewport: { width: 1024, height: 768 }
      }
    }
  ]
})
```

Keep the E2E tests in a stable folder such as `tests/` or `e2e/`, and add a script:

```json
{
  "scripts": {
    "e2e": "playwright test"
  }
}
```

Example test:

```js
import { expect, test } from 'playwright/test'

test('creates a participant', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: 'New participant' }).click()
  await page.getByLabel('Name').fill('Ada Lovelace')
  await page.getByLabel('Role').selectOption({ label: 'Organizer' })
  await page.getByRole('button', { name: 'Save' }).click()

  await expect(page.getByRole('heading', { name: 'Ada Lovelace' })).toBeVisible()
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

### 4. Prefer semantic locators

Prefer:
- `page.getByLabel(...)`
- `page.getByRole('button' | 'link' | 'tab' | 'dialog' | 'heading', { name: ... })`
- `locator.selectOption({ label: ... })` on a labeled native select
- URL and route assertions
- visible text assertions for content, not for locating controls

Avoid:
- generated class names
- CSS/XPath selectors
- DOM depth assumptions
- text-node clicks on interactive controls
- timing-only waits

The target is that a test reads the way a human would describe the interaction.

Good:

```js
await page.getByLabel('Email').fill('ada@example.com')
await page.getByRole('button', { name: 'Save' }).click()
await page.getByRole('dialog', { name: 'Publish results' })
await page.getByRole('tab', { name: 'Participants' }).click()
```

Avoid:

```js
await page.locator('.css-19x').click()
await page.locator('div > div:nth-child(3) button').click()
await page.getByText('Save').click()
```

If that does not work, first ask:
1. Is the control missing an accessible name?
2. Is the control missing the correct role?
3. Is the label relationship broken?
4. Is the control's visible text ambiguous?
5. Is the UI-library component failing to expose normal semantics?

Usually the correct fix is in the app or shared UI library, not in the test.

### 5. Accessibility is part of the E2E contract

Treat E2E friendliness and accessibility as the same concern:
- if a user can understand and activate a control, Playwright should usually be able to locate it semantically
- if Playwright needs brittle selectors, the UI is often also under-accessible
- adding proper labels, roles, and states improves both assistive technology support and E2E maintainability

That means:
- prefer visible labels and button text first
- use `role` and `aria-*` props when visible UI is not enough
- avoid burying the problem under `locator('xpath=...')`, `.nth(...)`, or DOM-shape selectors unless no realistic semantic alternative exists

StartupJS UI targets the modern React Native and React Native Web accessibility props:

```jsx
<Button aria-label='Delete participant' icon={faTrash} onPress={remove} />

<Div
  role='button'
  aria-label='Open participant card'
  aria-expanded={isOpen}
  onPress={open}
/>
```

Do not add or document legacy React Native accessibility props in StartupJS apps or StartupJS UI components:

- do not use `accessibilityLabel`
- do not use `accessibilityRole`
- do not add new explicit `accessibility*` props
- do not use `nativeID`; use `id` when an explicit web id is needed

Transparent wrappers such as `Div` and `Span` may pass unknown props through, but new app code and component APIs should use `role`, `aria-*`, `id`, and `testID`.

### 6. Use `testID` only as a fallback

`testID` is the standard React Native prop name. Use that exact casing.

On web, React Native Web renders `testID` as `data-testid`, and Playwright can find it with `page.getByTestId(...)`. Do not pass `testId` or `data-testid` to StartupJS UI components.

Use `testID` when a semantic locator is not a good fit:

- a portal, drawer, or popover surface that has no stable accessible name
- a generated calendar cell or other non-user-facing grid hook
- a low-level wrapper that needs a smoke assertion
- a custom renderer where the caller owns the interactive element

Do not use `testID` as the first choice for normal buttons, links, inputs, tabs, options, or dialogs. If those need `testID` to be usable in tests, first fix their role, label, or state semantics.

When adding `testID` support to source code:

- put it on an existing meaningful element
- do not add an extra wrapper only to host `testID`
- if the component already forwards `...props` to the right element, do not pluck and repass `testID` explicitly
- use predictable slot IDs only when needed, such as `${testID}-popover` or `${testID}-delete`
- cover the expected `testID` behavior in Storybook or E2E tests

### 7. Source-code checklist for friendly locators

When a locator is awkward, fix the source so the UI exposes the semantics a user expects:

- give every input a visible `label` or an explicit `aria-label`
- give icon-only buttons an `aria-label`
- use `role='button'`, `role='link'`, `role='tab'`, `role='dialog'`, `role='listbox'`, `role='option'`, or another appropriate web role for custom interactive surfaces
- expose state with `aria-expanded`, `aria-selected`, `aria-checked`, `aria-disabled`, `aria-busy`, and `aria-invalid` where relevant
- connect help/error text with `aria-describedby` when that text matters for the control
- use `aria-labelledby` when the accessible name comes from another visible element
- keep visible text and accessible names stable enough for tests to read naturally

If a StartupJS UI component already infers those props from normal API props such as `label`, `title`, `options`, or button children, prefer the normal API over manual ARIA.

### 8. Labels and `getByLabel`

StartupJS `Input` fields and low-level input components should be locatable by label on web. Prefer:

- `page.getByLabel('Field label')` for `.fill()`, `.inputValue()`, and native `type='select'` via `.selectOption()`.
- labels from normal props such as `label='Email'` instead of manual `aria-label` when using `Input`
- DOM fallback (`getByText` plus parent/child traversal) only for a temporary workaround that is tracked as a semantics bug

Example:

```js
await page.getByLabel('Email').fill('ada@example.com')
await page.getByLabel('Billing country').selectOption({ label: 'United States' })
await page.getByLabel('Birthday').click()
```

When implementing app UI:

```jsx
<Input type='text' label='Email' $value={$email} />
<Input type='select' label='Billing country' options={countries} $value={$country} />
<Input type='date' label='Birthday' $value={$birthday} />
```

If the visible label is not the right accessible name, use `aria-label` or `aria-labelledby` explicitly.

### Select / Dropdown / listbox (web) test contract

**`Input type='select'`** (StartupJS Select):

- Prefer `page.getByLabel('Field label').selectOption({ label: 'Option' })`.
- Use `page.getByTestId('field-combobox')` only as a fallback when the component exposes a documented `testID`-derived slot.
- Native `<option>` elements are exposed to Playwright as `role="option"`.

**`Dropdown` popover** and **AutoSuggest** / **MultiSelect** lists:

- Open list surfaces use `role="listbox"` on web.
- Rows use `role="option"` and `aria-selected` for the active value.
- Prefer `listbox.getByRole('option', { name: 'Option label' })` over `getByText` on the whole page.
- If the control is custom-rendered, make sure the trigger has a stable accessible name and useful state such as `aria-expanded`.

Example:

```js
await page.getByLabel('Billing country').selectOption({ label: 'United States' })
await page.getByRole('listbox').getByRole('option', { name: 'Create new' }).click()
```

### DateTimePicker (web) test contract

When using `@startupjs-ui/date-time-picker` or `Input` with `type='date'`:

- Prefer opening the field by label, for example `page.getByLabel('Starting date').click()`.
- Add `testID` when you need a stable hook for the popover or generated day cells.
- The anchored popover uses `{testID}-popover` on tablet/web.
- Calendar root uses `role="grid"` with accessible name `Calendar` (on the existing calendar wrapper, no extra layout node).
- Calendar day cells use `testID="{MM}-{DD}-{YYYY}"`, rendered on web as `data-testid` (for example `05-21-2026`).
- Day cells expose `role="gridcell"` with an accessible name like `May 21, 2026`.
- Month prev/next controls are the first two `button` roles inside the calendar grid.
- The readonly input exposes `aria-valuetext` with the formatted value; do not use `inputValue()` on RN-web.

Example:

```js
await page.getByLabel('Starting balance date').click()

const popover = page.getByTestId('starting-balance-date-popover')
await popover.getByRole('gridcell', { name: 'May 21, 2026' }).click()
```

### Modal / Dialog (web) test contract

`@startupjs-ui/modal` surfaces use `role="dialog"` and `aria-modal`.

- Prefer `page.getByRole('dialog', { name: 'Modal title' })` over `.filter({ has: getByText(...) })`.
- React Native `Modal` adds an outer `dialog` wrapper; use `.last()` to target the inner titled surface.
- With `title="..."` or string `Modal.Header` children, the title is linked via `aria-labelledby`.
- With custom `Modal.Header` content (for example `Span` title + close button), the dialog `aria-label` is derived from visible header text; header layout stays unchanged.
- Built-in `Modal.Actions` buttons expose `data-part="cancel"` and `data-part="confirm"` for fallback clicks when labels vary.

Example:

```js
const presetModal = page.getByRole('dialog', { name: 'Create Preset', exact: true }).last()
await presetModal.getByRole('button', { name: 'Save', exact: true }).click()
```

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

When you are working inside the shared UI library itself, add or fix semantics there and cover the expected locator behavior in Storybook interaction tests.

### When `exact: true` is appropriate

Do not use `exact: true` by default.

Use it only when accessible names are genuinely ambiguous for substring matching. If the simpler locator works naturally, prefer the simpler version.

### 9. Use explicit polling for backend-driven state

Prefer:

```js
await expect.poll(() => readThingFromDb()).not.toBeNull()
```

instead of:

```js
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
