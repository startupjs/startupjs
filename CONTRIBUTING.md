# Contributing to StartupJS

To initialize the monorepo, run:

```sh
yarn
```

After that you can run the styleguide project to develop the UI components, etc.. You can run it from the monorepo root with:

```sh
yarn start
```

To test creation of a fresh project:

```sh
yarn init-local
```

This will create a new project in `testapp` directory. You can run it from the monorepo root with:

```sh
yarn testapp start
```

If you have any questions or want to request a feature, please look wether a similar issue already exists in this repo, otherwise feel free to file a new one.

## Submitting Pull Requests

1. PR title has to follow [Conventional Changelog format](https://github.com/conventional-changelog/conventional-changelog/blob/master/packages/conventional-changelog-angular/README.md)

2. If you have breaking changes, you have to submit PR to be merged into `next` branch, instead of `master`. And in the description of PR please write `BREAKING CHANGE:` and describe below what this change is and how to perform the migration from old version to new, preferably with examples of old and new code.

## Instructions to merge Pull Requests for repository authors:

1. Feature branches without breaking changes must be merged to `master`.

    - Use **`Squash and merge`** merging strategy.
    - Title of PR must follow conventional commits format. If it doesn't -- edit the PR title before merging.
    - When you have a bunch of fixes/features in master, you can publish the patch version by using the command `yarn publish-patch`. It will also automatically update changelog.

2. If PR has breaking changes it must be merged to `next`.

    - Use **`Squash and merge`** merging strategy.
    - Title of PR must follow conventional commits format. Edit if it doesn't.
    - PR description must have `BREAKING CHANGE:` section, which should describe how to migrate from old code to new.
    - When merging such PR, you have to write at the end of squash commit `BREAKING CHANGE:`, then an empty line, and then copy-paste everything from the `BREAKING CHANGE:` section from the PR description as markdown (click `three dots` -> `Edit` in the PR description message to copy-paste the original markdown).

3. Do periodical updates from `master` to `next` manually on your local machine and just push `next` directly to github.

4. When releasing a new breaking version, make a PR from `next` to `master`.

    - **IMPORTANT!!!** Use regular **`Create a merge commit`** merge strategy when merging the PR. Because we must not lose any commits history when doing this merge.
    - After merge, use `yarn publish-minor` to publish the new breaking version to npm. It will also automatically update changelog.
    - Manually update `master` -> `next` and push `next` directly to github.
