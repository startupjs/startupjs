#!/bin/sh
set -e

# ----- Constants -----

# TODO: make the following to be passable options
DEFAULT_PERSISTENT_DIR="/workspace"
DEFAULT_HELPERS_DIR="/helpers"

# TODO: if DEFAULT_* options are passable, make the following var dynamic
VARIABLES_FILE="${DEFAULT_PERSISTENT_DIR}/variables.sh"

REQUIRED_VARS=(\
  "_APP" "_ZONE" \
  "PROJECT_ID" "BUILD_ID" "COMMIT_SHA" "REPO_NAME" "BRANCH_NAME" \
)
OPTIONAL_VARS=("_KUBE_CLUSTER_NAME" "_DOMAIN" "_PATH")

COMMANDS=("batch" "init" "testEnv" "build" "apply")

# TODO: just print joined array
#       https://stackoverflow.com/questions/1527049/how-can-i-join-elements-of-an-array-in-bash
HELP_MESSAGE="\
Available commands:\n\
\n\
  init\n\
  build\n\
  apply\n\
  clear-branches\n\
"

# ----- Errors -----

# ----- Helpers -----

_initKubectl () {
  gcloud container clusters get-credentials --zone $_ZONE $_KUBE_CLUSTER_NAME
}

_sourceEnv () {
  if test -f ${VARIABLES_FILE}; then
    . ${VARIABLES_FILE}
  fi
}

_validateVars () {
  for envVar in ${REQUIRED_VARS[@]}; do
    if ! ( printenv | grep -q "${envVar}=" ); then
      echo "ERROR! ${envVar} environment variable is required!" && exit 1
    fi
  done
}

# ----- Commands -----

# Pipe environment variables into some persistent place
# to be able to only specify them once in the first step
# and then just reuse
init () {
  _validateVars
  local envVar

  echo "#!/bin/sh" >> ${VARIABLES_FILE}

  for envVar in ${REQUIRED_VARS[@]}; do
    echo "export $(printenv | grep "${envVar}=")" >> ${VARIABLES_FILE}
  done
  for envVar in ${OPTIONAL_VARS[@]}; do
    if printenv | grep "${envVar}="; then
      echo "export $(printenv | grep "${envVar}=")" >> ${VARIABLES_FILE}
    fi
  done
}

testEnv () {
  _sourceEnv
  printenv
  echo "Hello World"
}

batch () {
  _validateVars
  # "init" is not needed when running batch, since it is the only command
  testEnv
}

# ----- Entry point -----

if [ "$1" = "help" ]; then
  echo "${HELP_MESSAGE}"
elif [ ! -z "$1" ] && [[ " ${COMMANDS[@]} " =~ " ${1} "  ]]; then
  ${1} "${@:2}"
else
  # This also gets run for the dummy "MUST_SPECIFY_COMMAND" CMD
  # specified in the Dockerfile
  echo "ERROR! Invalid or no command provided.\n${HELP_MESSAGE}"
  exit 1
fi
