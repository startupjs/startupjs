#!/bin/sh

SCRIPTPATH="`( cd \"$MY_PATH\" && pwd )`"

fn_local_init () {
  local path=$1

  echo "STEP: verdaccio install" &&
  npm i -g verdaccio &&

  echo "STEP: run verdaccio" &&
  verdaccio &

  echo "STEP: lerna publish" &&
  npx lerna publish prerelease --registry http://localhost:4873/ --no-git-tag-version --no-push --yes --no-git-reset &&

  if [ "$path" ] ; then
    cd $path
  fi

  echo "STEP: init app" &&
  npm_config_registry=http://localhost:4873/ npx startupjs init test &&

  cd ${SCRIPTPATH}/scripts &&
  node unpublish.js

  echo "STEP: uninstall verdaccio" &&
  npm uninstall -g verdaccio &&
}
