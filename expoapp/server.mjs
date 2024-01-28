// This is an example default server file.
// We actually don't need it since package.json/start-production just runs this inline
await import('startupjs/nodeRegister')
;(await import('startupjs/server')).default()
