// manually load the startupjs config instead of using the one which is
// automatically loaded from the startupjs.config.js file in the project root.
// This is useful when using startupjs in client-only mode and without its compilation pipeline.
export { default } from '@startupjs/registry/loadStartupjsConfig'
