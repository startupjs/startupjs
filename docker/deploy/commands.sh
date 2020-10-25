#!/bin/bash
set -e

# ----- Constants -----

SRC_PATH="/src"

# TODO: make the following to be passable options
DEFAULT_PERSISTENT_PATH="/workspace"
DEFAULT_PATH="."

# TODO: if DEFAULT_* options are passable, make the following var dynamic
VARIABLES_FILE="${DEFAULT_PERSISTENT_PATH}/variables.sh"
COMPILED_PATH="${DEFAULT_PERSISTENT_PATH}/compiled"

DEFAULT_DOCKERFILE_PATH="$SRC_PATH/helpers/Dockerfile"

REQUIRED_VARS=(\
  "_APP" \
  "PROJECT_ID" "BUILD_ID" "COMMIT_SHA" "REPO_NAME" "BRANCH_NAME" \
)
OPTIONAL_VARS=("_ZONE" "_CLUSTER_NAME" "_DOMAIN" "_PATH")

COMMANDS=("init" "build" "push" "pushLatest" "compile" "apply" "applyVersion" "batch")

# TODO: just print joined array
#       https://stackoverflow.com/questions/1527049/how-can-i-join-elements-of-an-array-in-bash
HELP_MESSAGE="\
Available commands:\n\
\n\
  init\n\
  build\n\
  push\n\
  pushLatest\n\
  compile\n\
  apply\n\
  applyVersion\n\
  batch\n\
"

# ----- Global vars -----

SKIP_WRITE_ENV=""

# ----- Errors -----

# ----- Helpers -----

function _log {
  local message=$1
  printf "\n\n\n\n---> %s\n\n" "$message"
}

function _initKubectl {
  local clusterName=${_CLUSTER_NAME:-$PROJECT_ID}
  local zone=${_ZONE:-"us-east1-d"}
  gcloud container clusters get-credentials --zone "$zone" "$clusterName"
}

function _sourceEnv {
  if test -f ${VARIABLES_FILE}; then
    # shellcheck source=/dev/null
    . ${VARIABLES_FILE}
  fi
  _validateVars
}

function _validateVars {
  for envVar in "${REQUIRED_VARS[@]}"; do
    if ! ( printenv | grep -q "${envVar}=" ); then
      echo "ERROR! ${envVar} environment variable is required!"
      exit 1
    fi
  done
}

function _writeEnv {
  local envVar

  echo "#!/bin/sh" >> ${VARIABLES_FILE}

  for envVar in "${REQUIRED_VARS[@]}"; do
    echo "export $(printenv | grep "${envVar}=")" >> ${VARIABLES_FILE}
  done
  for envVar in "${OPTIONAL_VARS[@]}"; do
    if printenv | grep "${envVar}="; then
      echo "export $(printenv | grep "${envVar}=")" >> ${VARIABLES_FILE}
    fi
  done
}

# https://pempek.net/articles/2013/07/08/bash-sh-as-template-engine/
# Improved to properly handle "
# since the original script was stripping them
function _renderTemplate {
  # shellcheck disable=SC2086,SC2002,SC1001
  eval "echo \"$(cat $1 | sed s/\"/\__q__/g)\"" | sed s/__q__/\"/g
}

function _compileFile {
  local template=$1
  local compiledPath=${2:-$COMPILED_PATH}
  printf "> Compile %s\n" "$template"

  # validate syntax by just trying to compile the template
  _renderTemplate "$template"

  # write compiled file into the compilation output folder
  mkdir -p "$compiledPath"
  outputFilename="$compiledPath/$(basename "$template")"
  _renderTemplate "$template" > "$outputFilename"
  printf "> success! Compiled file: %s\n" "$outputFilename"
}

# ----- Commands -----

# Pipe environment variables into some persistent place
# to be able to only specify them once in the first step
# and then just reuse
function init {
  _log "Init deployment configuration"

  _validateVars

  if [ -z "$SKIP_WRITE_ENV" ]; then
    _writeEnv
  fi
}

function build {
  _log "Build docker image"
  _sourceEnv

  local path=${_PATH:-$DEFAULT_PATH}
  local dockerfilePath="$path/Dockerfile"

  if [ ! -f "$dockerfilePath" ]; then
    printf "\nWARNING! Dockerfile not found!\nUsing the default StartupJS Dockerfile.\n\n"
    dockerfilePath="$DEFAULT_DOCKERFILE_PATH"
  fi

  docker build \
    --tag=gcr.io/"$PROJECT_ID"/"$_APP":"$COMMIT_SHA" \
    --tag=gcr.io/"$PROJECT_ID"/"$_APP":latest \
    -f "$dockerfilePath" \
    .
}

function push {
  _log "Push to registry with sha tag"
  _sourceEnv
  docker push \
    gcr.io/"$PROJECT_ID"/"$_APP":"$COMMIT_SHA"
}

function pushLatest {
  _log "Push to registry as latest"
  _sourceEnv
  docker push \
    gcr.io/"$PROJECT_ID"/"$_APP":latest
}

function compile {
  _log "Compile Kubernetes resources"
  _sourceEnv

  local filename

  for filename in "$SRC_PATH"/main/resources/*.yaml; do
    _compileFile "$filename" "$COMPILED_PATH"
    # TODO: remove
    cat "$COMPILED_PATH/$(basename "$filename")"
  done

  echo "$COMPILED_PATH"
  ls "$COMPILED_PATH"
}

function apply {
  _log "Apply Kubernetes resources"
  _sourceEnv

  _initKubectl
  # TODO: remove --dry-run in real deploy
  kubectl apply -f "$COMPILED_PATH"
}

function applyVersion {
  _log "Update server deployment version in Kubernetes"
  _sourceEnv

  _initKubectl
  kubectl set image deployment/"$_APP"-server "$_APP"-server=gcr.io/"$PROJECT_ID"/"$_APP":"$COMMIT_SHA" --record
}

function batch {
  # We don't need to persist env vars into file since 'batch'
  # executes everything in one CI step.
  SKIP_WRITE_ENV="true"

  init
  build
  push
  pushLatest
  if [ "$1" = "--version-only" ]; then
    applyVersion
  else
    compile
    apply
  fi
}

# ----- Entry point -----

# shellcheck disable=SC2199,SC2076
if [ "$1" = "help" ]; then
  echo "${HELP_MESSAGE}"
elif [ -n "$1" ] && [[ " ${COMMANDS[@]} " =~ " ${1} "  ]]; then
  ${1} "${@:2}"
else
  # This also gets run for the dummy "MUST_SPECIFY_COMMAND" CMD
  # specified in the Dockerfile
  printf "ERROR! Invalid or no command provided.\n%s\n" "$HELP_MESSAGE"
  exit 1
fi

# ----- Refs -----
# [1] args parsing for the whole script or a function:
#     https://stackoverflow.com/a/21128172/1930491
