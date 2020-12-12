#!/bin/sh

BASEDIR="$(pwd)/scripts"

fn_local_init () {
  set -e
  TEMP_PATH=${1:-"."}
  STATUS="running"

  echo ">>> path: $TEMP_PATH"
  echo ">>> basedir: $BASEDIR"

  echo ">>> STEP 0: kill verdaccio if it left running from the last time"
  verdaccio_pid=$(lsof -i:4873 | awk 'FNR > 1 {print $2}') && [ -z "$verdaccio_pid" ] || kill -9 $verdaccio_pid

  echo ">>> STEP 1: verdaccio install"
  npm i -g verdaccio verdaccio-auth-memory verdaccio-memory

  echo ">>> STEP 2: run verdaccio"
  verdaccio --config "${BASEDIR}/verdaccio_config.yaml" &
  sleep 5

  echo ">>> STEP 3: lerna publish. Ignore any version bumps using intermediate branch."
  git stash
  git branch -d verdaccio-temp || true
  git checkout -b verdaccio-temp
  git stash apply
  npx lerna publish prerelease --registry http://localhost:4873/ --no-git-tag-version --no-private --no-push --yes --no-git-reset --dist-tag local || STATUS="failed-lerna"
  git reset --hard HEAD
  git checkout -
  git stash pop
  git branch -d verdaccio-temp

  if [ "$STATUS" = "running" ]; then
    echo ">>> STEP 4: init app"
    rm -rf "${TEMP_PATH}/testapp"
    npm_config_registry=http://localhost:4873/ LOCAL_DIR=${TEMP_PATH} npx startupjs@local init testapp || STATUS="failed-init"
  fi;

  echo ">>> STEP 5: kill verdaccio"
  verdaccio_pid=$(lsof -i:4873 | awk 'FNR > 1 {print $2}') && [ -z "$verdaccio_pid" ] || kill $verdaccio_pid

  echo ">>> STEP 6: uninstall verdaccio"
  npm uninstall -g verdaccio verdaccio-auth-memory verdaccio-memory

  if [ "$STATUS" = "failed-lerna" ]; then echo "!!! ERROR !!! 'lerna publish' failed!" && exit 1; fi
  if [ "$STATUS" = "failed-init" ]; then echo "!!! ERROR !!! 'npx startupjs init' failed!" && exit 1; fi
  printf "\n\n\n\n"
  echo "SUCCESS! 'testapp' folder created."
  echo "You can run 'yarn' commands of testapp without going into its directory using 'yarn testapp'"
  echo "For example:"
  echo "  start:   'yarn testapp start'"
  echo "  metro:   'yarn testapp metro'"
  echo "  ios:     'yarn testapp ios'"
  echo "  android: 'yarn testapp android'"
  echo "  etc."
}

fn_update_changelog () {
  set -e
  git tag -d "v$(node -e "console.log(require('./lerna.json').version)")"
  yarn changelog
  git add CHANGELOG.md
  git commit --amend --no-edit
  git tag "v$(node -e "console.log(require('./lerna.json').version)")"
  git push
  git push --tags
}
