#!/bin/sh

# Get current .sh script's path
# ref: https://stackoverflow.com/a/43919044/1930491
a="/$0"; a=${a%/*}; a=${a#/}; a=${a:-.}; BASEDIR=$(cd "$a"; pwd)

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
  rm -rf testapp &&
  npm_config_registry=http://localhost:4873/ npx startupjs init testapp &&

  cd ${BASEDIR} &&
  node unpublish.js

  echo "STEP: uninstall verdaccio" &&
  npm uninstall -g verdaccio &&
}
