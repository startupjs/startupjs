# StartupJS Meta-package

This is a `startupjs` Meta-package which wraps all the main packages together
for easier distribution as a single package.

For the overall StartupJS readme refer to the root monorepo`s README.

## Extra dependencies

- `events` is added here as an explicit dependency since it's used inside `racer`.
  Which does not list it in its own dependencies. Usually on the browser it will be polyfilled by
  webpack, but in our case Metro does not polyfill it on it's own so we have to have it
  present in our dependencies somewhere.
