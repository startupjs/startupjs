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

### `check`

Type-check the current project with React-Pug support.

You can pass specific files, for example `npx startupjs check src/App.tsx`.

### `start-production`

Start production node server with production web build

(run this after `npx startupjs build`)

### `init-pm`, `pr`, `task <github_issue_number>`

Project management helper commands.

See [`@startupjs/pm` readme](../pm) for documentation on them.
