#!/bin/sh

BASEDIR="$(pwd)/scripts"

fn_local_init () {
  set -e
  TEMP_PATH=${1:-"."}

  echo ">>> path: $TEMP_PATH"
  echo ">>> basedir: $BASEDIR"

  echo ">>> STEP 0: kill verdaccio if it left running from the last time"
  verdaccio_pid=$(lsof -i:4873 | awk 'FNR > 1 {print $2}') && [ -z "$verdaccio_pid" ] || kill -9 $verdaccio_pid

  echo ">>> STEP 1: verdaccio install"
  npm i -g verdaccio verdaccio-auth-memory verdaccio-memory

  echo ">>> STEP 2: run verdaccio"
  verdaccio --config "${BASEDIR}/verdaccio_config.yaml" &
  sleep 5

  echo ">>> STEP 3: lerna publish"
  npx lerna publish prerelease --registry http://localhost:4873/ --no-git-tag-version --no-private --no-push --yes --no-git-reset --dist-tag local

  echo ">>> STEP 4: init app"
  rm -rf "${TEMP_PATH}/testapp"
  npm_config_registry=http://localhost:4873/ LOCAL_DIR=${TEMP_PATH} npx startupjs@local init testapp

  echo ">>> STEP 6: kill verdaccio"
  verdaccio_pid=$(lsof -i:4873 | awk 'FNR > 1 {print $2}') && [ -z "$verdaccio_pid" ] || kill $verdaccio_pid

  echo ">>> STEP 7: uninstall verdaccio"
  npm uninstall -g verdaccio verdaccio-auth-memory verdaccio-memory
}
