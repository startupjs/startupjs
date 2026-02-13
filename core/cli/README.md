# startupjs cli

## Usage

```
npx startupjs <command> [options]
```

## Commands

### `install`

Run `npx startupjs install --help` for a full manual

### `build`

Build web bundle for production usage

### `start-production`

Start production node server with production web build

(run this after `npx startupjs build`)

### `start-worker`

Start worker node server (uses current `NODE_ENV`)

### `start-worker-production`

Start worker node server with `NODE_ENV=production`

### `init-pm`, `pr`, `task <github_issue_number>`

Project management helper commands.

See [`@startupjs/pm` readme](../pm) for documentation on them.
