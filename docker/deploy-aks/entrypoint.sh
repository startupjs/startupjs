#!/bin/sh
# shellcheck disable=SC2059,SC2236

# Fail script on first failed command
set -e

# MANUAL:
#
# This script runs in 4 stages and relies on a custom docker image
# based on official azure-cli image (alpine) with 'kaniko' binary on top of it.
#
# It supports a batch mode execution as well as a step-by-step execution.
#
# BATCH mode:
#
#   Just run the script without sepcifying any param. It will execute
#   all steps one after another.
#
#   Requirements:
#     a) You have to pass the following env vars:
#        - AZURE_CREDENTIALS
#        - APP
#        - COMMIT_SHA
#      b) Mount the source code of your app as `/project`
#         You can configure project path in container by passing env var PROJECT_PATH
#
# STEP-BY-STEP mode:
#
#   For step by step execution it passes ENV vars from step to step using
#   a generated intermediary 'vars.sh' file which must be mounted when
#   running each step.
#
#   Since 'init' step is baked into the docker image, you have to execute
#   the following 3 steps in a sequence:
#   1. prepare
#   2. build
#   3. apply
#
# STEPS:
#
# 0. init
#
#    install all binaries. This is the RUN in Dockerfile of the custom image
#
# 1. prepare
#
#    obtain all dynamic vars and generate the shell script which exports them
#
#    Requirements:
#      a) You have to pass the following env vars:
#         - AZURE_CREDENTIALS
#         - APP
#         - COMMIT_SHA
#      b) You have to provide the volume mount for the /tmp/vars folder in the container
#
#    Artifacts:
#      Generates /tmp/vars/vars.sh file (path is customizable with $ENV_VARS_FILE)
#      which will be reused in the later steps.
#
# 2. build
#
#    build the app image
#
#    Requirements:
#      a) You have to mount the same folder for /tmp/vars as you did in 'prepare' step
#      b) Mount the source code of your app as `/project`
#         You can configure project path in container by passing env var PROJECT_PATH
#
# 3. apply
#
#    deploy to the opinionated kubernetes cluster
#
#    Requirements:
#      You have to mount the same folder for /tmp/vars as you did in 'prepare' step

# CONSTANTS
ENV_VARS_FILE=${ENV_VARS_FILE:-"/tmp/vars/vars.sh"}
PROJECT_PATH=${PROJECT_PATH:-"/project"}
DOCKERFILE_PATH=${DOCKERFILE_PATH:-"$PROJECT_PATH/Dockerfile"}

# if we are in steps mode we need to pass config from step to step using a temp
# $ENV_VARS_FILE file
PASS_ENV="1"

main () {
  _command=$1

  case "$_command" in
    "init"    ) run_step_init;;
    "prepare" ) run_step_prepare;;
    "build"   ) run_step_build;;
    "apply"   ) run_step_apply;;
    "batch"   ) run_batch;;
    *         ) echo "ERROR! Command '${_command}' not found.";;
  esac

  # integration_test
}

# -----------------------------------------------------------------------------
#   BATCH
# -----------------------------------------------------------------------------

run_batch () {
  # in batch mode we don't need to pass config through a temp file
  PASS_ENV=""
  _log "validate_batch" && validate_batch
  # NOTE: run_step_init is executed as RUN when building an image from Dockerfile
  _step "prepare" && run_step_prepare
  _step "build" && run_step_build
  _step "apply" && run_step_apply
}

validate_batch () {
  validate_step_prepare
  validate_step_build
  validate_step_apply
}

# -----------------------------------------------------------------------------
#   Step 0: init
# -----------------------------------------------------------------------------

run_step_init () {
  _log "install_generic" && install_generic
  _log "install_kubectl" && install_kubectl
  _log "install_neat" && install_neat
}

install_generic () {
  return 0
}

install_kubectl () {
  az aks install-cli
}

install_neat () {
  set -x; cd "$(mktemp -d)" &&
  OS="$(uname | tr '[:upper:]' '[:lower:]')" &&
  ARCH="$(uname -m | sed -e 's/x86_64/amd64/' -e 's/\(arm\)\(64\)\?.*/\1\2/' -e 's/aarch64$/arm64/')" &&
  KREW="krew-${OS}_${ARCH}" &&
  curl -fsSLO "https://github.com/kubernetes-sigs/krew/releases/latest/download/${KREW}.tar.gz" &&
  tar zxvf "${KREW}.tar.gz" &&
  ./"${KREW}" install krew

  kubectl krew install neat
}

# -----------------------------------------------------------------------------
#   Step 1: prepare
# -----------------------------------------------------------------------------

run_step_prepare () {
  _log "validate_step_prepare" && validate_step_prepare
  _log "init_primary_variables" && init_primary_variables
  _log "maybe_login_az" && maybe_login_az
  _log "init_secondary_variables" && init_secondary_variables
  maybe_export_env
}

validate_step_prepare () {
  if [ ! -n "$AZURE_CREDENTIALS" ]; then echo "AZURE_CREDENTIALS env var is required" && exit 1; fi
  if [ ! -n "$APP" ]; then echo "APP env var is required" && exit 1; fi
  if [ ! -n "$COMMIT_SHA" ]; then echo "COMMIT_SHA env var is required" && exit 1; fi
}

init_primary_variables () {
  CLIENT_ID=$( _get_json_value 'clientId' )
  CLIENT_SECRET=$( _get_json_value 'clientSecret' )
  TENANT_ID=$( _get_json_value 'tenantId' )
}

maybe_login_az () {
  if [ -n "$DONE_maybe_login_az" ]; then return 0; fi
  az login \
    --service-principal \
    -u "$CLIENT_ID" \
    -p "$CLIENT_SECRET" \
    --tenant "$TENANT_ID"
  DONE_maybe_login_az="1"
}

init_secondary_variables () {
  CLUSTER_NAME=$( az aks list --query '[].name' -o tsv | head -1 )
  RESOURCE_GROUP_NAME=$( az aks list --query '[].resourceGroup' -o tsv | head -1 )
  REGISTRY_SERVER=$( az acr list --query '[].loginServer' -o tsv | head -1 )
}

# -----------------------------------------------------------------------------
#   Step 2: build
# -----------------------------------------------------------------------------

run_step_build () {
  maybe_import_env
  _log "validate_step_build" && validate_step_build
  _log "copy_source_code" && copy_source_code
  _log "build_image_kaniko" && build_image_kaniko
}

validate_step_build () {
  if ! which executor; then echo "'executor' binary is not found. Your docker image was probably built incorrectly and doesn't have kaniko binaries." && exit 1; fi
  if [ ! -d "$PROJECT_PATH" ] || [ -z "$(ls -A "$PROJECT_PATH")" ]; then echo "app folder '$PROJECT_PATH' does not exist or is empty. You've probably forgot to mount it as /project or did not pass a custom PROJECT_PATH env var" && exit 1; fi
  if [ -z "$DEPLOYMENTS" ] && [ ! -f "$PROJECT_PATH/Dockerfile" ]; then echo "app Dockerfile was not found at '$DOCKERFILE_PATH' and DEPLOYMENTS env var is not set" && exit 1; fi
}

copy_source_code () {
  cp -r "$PROJECT_PATH" /_project
}

build_image_kaniko () {
  mkdir -p /kaniko/.docker
  # authorize to registry
  echo "{\"auths\":{\"${REGISTRY_SERVER}\":{\"auth\":\"$(printf "%s:%s" "${CLIENT_ID}" "${CLIENT_SECRET}" | base64 | tr -d '\n')\"}}}" > /kaniko/.docker/config.json
  if [ -n "$DEPLOYMENTS" ]
  then
    for dockerfile in $(echo $DEPLOYMENTS | tr "," "\n")
    do
        SERVICE=$(echo $dockerfile | cut -d ":" -f 1)
        DOCKERFILE_PATH=$(echo $dockerfile | cut -d ":" -f 2)
        echo "Building docker image for ${SERVICE} microservice from dockerfile: ${DOCKERFILE_PATH}"
        if [ -n "$FEATURE" ]
        then
          executor \
            --context /_project \
            --dockerfile "$DOCKERFILE_PATH" \
            --destination "${REGISTRY_SERVER}/${APP}-${SERVICE}-${FEATURE}:${COMMIT_SHA}" \
            --destination "${REGISTRY_SERVER}/${APP}-${SERVICE}-${FEATURE}:latest"
        else
          executor \
            --context /_project \
            --dockerfile "$DOCKERFILE_PATH" \
            --destination "${REGISTRY_SERVER}/${APP}-${SERVICE}:${COMMIT_SHA}" \
            --destination "${REGISTRY_SERVER}/${APP}-${SERVICE}:latest"
        fi
    done
  fi

  if [ -f "$PROJECT_PATH/Dockerfile" ]
  then
    if [ -n "$FEATURE" ]
    then
      executor \
        --context /_project \
        --dockerfile "$DOCKERFILE_PATH" \
        --destination "${REGISTRY_SERVER}/${APP}-${FEATURE}:${COMMIT_SHA}" \
        --destination "${REGISTRY_SERVER}/${APP}-${FEATURE}:latest"
    else
      executor \
        --context /_project \
        --dockerfile "$DOCKERFILE_PATH" \
        --destination "${REGISTRY_SERVER}/${APP}:${COMMIT_SHA}" \
        --destination "${REGISTRY_SERVER}/${APP}:latest"
    fi
  fi
}

# -----------------------------------------------------------------------------
#   Step 3: apply
# -----------------------------------------------------------------------------

run_step_apply () {
  maybe_import_env
  _log "validate_step_apply" && validate_step_apply
  _log "maybe_login_az" && maybe_login_az
  _log "login_kubectl" && login_kubectl
  _log "update_secret" && update_secret
  _log "update_deployments" && update_deployments
  maybe_delete_env
}

validate_step_apply () {
  return 0 # dummy. no checks here yet
}

login_kubectl () {
  az aks get-credentials --resource-group "$RESOURCE_GROUP_NAME" --name "$CLUSTER_NAME"
}

update_secret () {
  _secrets_yaml=$(_get_keyvault_secrets_yaml)
  echo "$_secrets_yaml" | kubectl apply -f -
}

# TODO: Make keyvault update optional -- just ignore it if it doesn't exist
_get_keyvault_secrets_yaml () {
  _cluster_name_hash=$(printf "$CLUSTER_NAME" | md5sum | awk '{print $1}' | grep -o '.....$')
  _vault_name="${APP}-${_cluster_name_hash}"
  touch ./secrets.env
  for _name in $(az keyvault secret list --vault-name "$_vault_name" --query "[].name" -o tsv); do
    _value=$(az keyvault secret show --vault-name "$_vault_name" -n "$_name" --query "value" -o tsv)
    _name=$(echo "$_name" | sed 's/-/_/g')
    echo "${_name}=${_value}" >> ./secrets.env
  done
  # Next command will output the yaml to stdout and we'll catch it outside
  kubectl create secret generic "$APP" --type=Opaque --from-env-file=./secrets.env --dry-run -o yaml
  rm ./secrets.env
}

update_deployments () {
  if [ -n "$FEATURE" ]
  then
    if [ -n "$DEPLOYMENTS" ]
    then
      kubectl get deploy -l "managed-by=terraform,part-of=${APP}" -o json \
        | kubectl-neat \
        | jq '.items[]' \
        | jq 'del(.metadata.annotations["meta.helm.sh/release-name"])' \
        | jq 'del(.metadata.annotations["meta.helm.sh/release-namespace"])' \
        | jq 'del(.metadata.annotations["deployment.kubernetes.io/revision"])' \
        | jq 'del(.metadata.annotations["kubernetes.io/change-cause"])' \
        | jq 'del(.metadata.labels["app.kubernetes.io/managed-by"])' \
        | jq ".metadata.name = \"${APP}-\" + .metadata.labels.microservice + \"-${FEATURE}\"" \
        | jq ".metadata.labels.app = \"${APP}-\" + .metadata.labels.microservice + \"-${FEATURE}\"" \
        | jq '.metadata.labels["managed-by"] = "terraform-startupjs-features"' \
        | jq ".spec.selector.matchLabels.app = \"${APP}-\" + .metadata.labels.microservice + \"-${FEATURE}\"" \
        | jq ".spec.template.metadata.labels.app = \"${APP}-\" + .metadata.labels.microservice + \"-${FEATURE}\"" \
        | jq '.spec.template.metadata.labels["managed-by"] = "terraform-startupjs-features"' \
        | jq ".spec.template.spec.containers[0].image = \"${REGISTRY_SERVER}/${APP}-\" + .metadata.labels.microservice + \"-${FEATURE}:${COMMIT_SHA}\"" \
        | kubectl apply -f -
    else
      kubectl get deploy -l "managed-by=terraform,part-of=${APP}" -o json \
        | kubectl-neat \
        | jq '.items[]' \
        | jq 'del(.metadata.annotations["meta.helm.sh/release-name"])' \
        | jq 'del(.metadata.annotations["meta.helm.sh/release-namespace"])' \
        | jq 'del(.metadata.annotations["deployment.kubernetes.io/revision"])' \
        | jq 'del(.metadata.annotations["kubernetes.io/change-cause"])' \
        | jq 'del(.metadata.labels["app.kubernetes.io/managed-by"])' \
        | jq ".metadata.name = \"${APP}-\" + .metadata.labels.microservice + \"-${FEATURE}\"" \
        | jq ".metadata.labels.app = \"${APP}-\" + .metadata.labels.microservice + \"-${FEATURE}\"" \
        | jq '.metadata.labels["managed-by"] = "terraform-startupjs-features"' \
        | jq ".spec.selector.matchLabels.app = \"${APP}-\" + .metadata.labels.microservice + \"-${FEATURE}\"" \
        | jq ".spec.template.metadata.labels.app = \"${APP}-\" + .metadata.labels.microservice + \"-${FEATURE}\"" \
        | jq '.spec.template.metadata.labels["managed-by"] = "terraform-startupjs-features"' \
        | jq ".spec.template.spec.containers[0].image = \"${REGISTRY_SERVER}/${APP}-${FEATURE}:${COMMIT_SHA}\"" \
        | kubectl apply -f -
    fi

    kubectl get service -l "managed-by=terraform,part-of=${APP}" -o json \
      | kubectl-neat \
      | jq '.items[]' \
      | jq "del(.spec.clusterIP)" \
      | jq "del(.spec.clusterIPs)" \
      | jq 'del(.metadata.annotations["meta.helm.sh/release-name"])' \
      | jq 'del(.metadata.annotations["meta.helm.sh/release-namespace"])' \
      | jq 'del(.metadata.labels["app.kubernetes.io/managed-by"])' \
      | jq ".metadata.name = \"${APP}-\" + .metadata.labels.microservice + \"-${FEATURE}\"" \
      | jq ".metadata.labels.app = \"${APP}-\" + .metadata.labels.microservice + \"-${FEATURE}\"" \
      | jq '.metadata.labels["managed-by"] = "terraform-startupjs-features"' \
      | jq ".spec.selector.app = \"${APP}-\" + .metadata.labels.microservice + \"-${FEATURE}\"" \
      | kubectl apply -f -

    if [ -n "$FEATURE_WILDCARD" ]
    then
      kubectl get ingress -l "managed-by=terraform,part-of=${APP}" -o json \
        | kubectl-neat \
        | jq '.items[]' \
        | jq 'del(.metadata.annotations["meta.helm.sh/release-name"])' \
        | jq 'del(.metadata.annotations["meta.helm.sh/release-namespace"])' \
        | jq 'del(.metadata.labels["app.kubernetes.io/managed-by"])' \
        | jq ".metadata.name = \"${APP}-\" + .metadata.labels.microservice + \"-${FEATURE}\"" \
        | jq ".metadata.labels.app = \"${APP}-\" + .metadata.labels.microservice + \"-${FEATURE}\"" \
        | jq '.metadata.labels["managed-by"] = "terraform-startupjs-features"' \
        | jq "del(.spec.rules[1,2,3,4,5])" \
        | jq ".spec.rules[].host = \"${FEATURE}.${FEATURE_DOMAIN}\"" \
        | jq ".spec.rules[].http.paths[].backend.service.name = \"${APP}-\" + .metadata.labels.microservice + \"-${FEATURE}\"" \
        | jq "del(.spec.tls[1,2,3,4,5])" \
        | jq ".spec.tls[0].hosts = [\"${FEATURE}.${FEATURE_DOMAIN}\"]" \
        | jq ".spec.tls[0].secretName = \"${APP}-features-cert\"" \
        | kubectl apply -f -
    else
      kubectl get ingress -l "managed-by=terraform,part-of=${APP}" -o json \
        | kubectl-neat \
        | jq '.items[]' \
        | jq 'del(.metadata.annotations["meta.helm.sh/release-name"])' \
        | jq 'del(.metadata.annotations["meta.helm.sh/release-namespace"])' \
        | jq 'del(.metadata.labels["app.kubernetes.io/managed-by"])' \
        | jq ".metadata.name = \"${APP}-\" + .metadata.labels.microservice + \"-${FEATURE}\"" \
        | jq ".metadata.labels.app = \"${APP}-\" + .metadata.labels.microservice + \"-${FEATURE}\"" \
        | jq '.metadata.labels["managed-by"] = "terraform-startupjs-features"' \
        | jq "del(.spec.rules[1,2,3,4,5])" \
        | jq ".spec.rules[].host = \"${FEATURE}.${FEATURE_DOMAIN}\"" \
        | jq ".spec.rules[].http.paths[].backend.service.name = \"${APP}-\" + .metadata.labels.microservice + \"-${FEATURE}\"" \
        | jq "del(.spec.tls[1,2,3,4,5])" \
        | jq ".spec.tls[0].hosts = [\"${FEATURE}.${FEATURE_DOMAIN}\"]" \
        | jq ".spec.tls[0].secretName = \"${APP}-\" + .metadata.labels.microservice + \"-${FEATURE}-cert\"" \
        | kubectl apply -f -
    fi
  else
    for _name in $(kubectl get deployments -l "managed-by=terraform,part-of=${APP}" --no-headers -o custom-columns=":metadata.name"); do
      SERVICE=$(echo $NAME | cut -d "-" -f 2)
      if [[ "$DEPLOYMENTS" =~ .*"$SERVICE:".* ]]; then
        kubectl set image "deployment/$_name" "$_name=${REGISTRY_SERVER}/${_name}:${COMMIT_SHA}" --record
      else
        kubectl set image "deployment/$_name" "$_name=${REGISTRY_SERVER}/${APP}:${COMMIT_SHA}" --record
      fi
    done
  fi
}

# ----- test -----

integration_test () {
  az aks list -o table
  az acr list -o table
  kubectl get pods
}

# ----- export/import env vars -----
#
# NOTE: This is only used when when executing steps manually.
#       It's not needed in batch mode at all. That's why in batch mode
#       we unset the global flag PASS_ENV

maybe_export_env () {
  if [ ! -n "$PASS_ENV" ]; then return 0; fi
  mkdir -p "$( dirname "$ENV_VARS_FILE" )"
  {
    echo "export CLUSTER_NAME=$CLUSTER_NAME"
    echo "export RESOURCE_GROUP_NAME=$RESOURCE_GROUP_NAME"
    echo "export REGISTRY_SERVER=$REGISTRY_SERVER"
    echo "export CLIENT_ID=$CLIENT_ID"
    echo "export CLIENT_SECRET=$CLIENT_SECRET"
    echo "export TENANT_ID=$TENANT_ID"
    echo "export APP=$APP"
    echo "export COMMIT_SHA=$COMMIT_SHA"
  } > "$ENV_VARS_FILE"
}

maybe_import_env () {
  if [ ! -n "$PASS_ENV" ]; then return 0; fi
  if [ ! -f "$ENV_VARS_FILE" ]; then echo "env vars file '$ENV_VARS_FILE' not found" && exit 1; fi
  # shellcheck source=/dev/null
  . "$ENV_VARS_FILE"
  if [ ! -n "$CLUSTER_NAME" ]; then echo "CLUSTER_NAME env var is required" && exit 1; fi
  if [ ! -n "$RESOURCE_GROUP_NAME" ]; then echo "RESOURCE_GROUP_NAME env var is required" && exit 1; fi
  if [ ! -n "$REGISTRY_SERVER" ]; then echo "REGISTRY_SERVER env var is required" && exit 1; fi
  if [ ! -n "$CLIENT_ID" ]; then echo "CLIENT_ID env var is required" && exit 1; fi
  if [ ! -n "$CLIENT_SECRET" ]; then echo "CLIENT_SECRET env var is required" && exit 1; fi
  if [ ! -n "$TENANT_ID" ]; then echo "TENANT_ID env var is required" && exit 1; fi
  if [ ! -n "$APP" ]; then echo "APP env var is required" && exit 1; fi
  if [ ! -n "$COMMIT_SHA" ]; then echo "COMMIT_SHA env var is required" && exit 1; fi
}

maybe_delete_env () {
  if [ ! -n "$PASS_ENV" ]; then return 0; fi
  rm -f "$ENV_VARS_FILE"
}

# ----- helpers -----

_get_json_value () {
  _key=$1
  echo "$AZURE_CREDENTIALS" | grep -o "\"${_key}\"[^\"]*\"[^\"]*" | sed -n 's/"[^"]*"[^"]*"//p'
}

_step () {
  _message=$1
  _current_step=${_current_step:-1}
  printf "\n\033[0;36m[STEP ${_current_step}] ${_message}\033[0m\n\n"
  _current_step=$((_current_step + 1))
}

_log () {
  _message=$1
  printf "\n\033[0;36m- ${_message}\033[0m\n\n"
}

main "$@"; exit
