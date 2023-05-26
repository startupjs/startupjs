# startupjs/deploy-aks

> fully universal docker container to build and deploy the startupjs app to an opinionated AKS cluster.

It uses `kaniko` under the hood to build an image in any `docker` runtime, so you can use docker binary of any CI/CD provider or Kubernetes or your local Docker. It does **NOT** need root or `--privileged` or any other custom configuration, only a regular `docker run` with an ability to pass env vars and mount the source code inside it.

## AKS cluster requirements:

1. You must provide a service principal key `AZURE_CREDENTIALS` which has access to only one resource group which has only one AKS cluster and only one ACR. It doesn't matter how you name them.

2. Deployments which you want to update in this cluster must have the following labels in `metadata.labels`:

    ```
    managed-by=terraform
    part-of=${APP}
    ```

    Replace ${APP} with the name of your app, for example `part-of=myapp`

3. Container name inside the Deployment (`spec.template.spec.containers[0].name`) must be the same as the Deployment name itself (`metadata.name`)

## How to test the build and deploy process:

You can test using your local docker. Just install Docker Desktop if you don't have it yet and then:

1. Save the script below as `test_deploy.sh` in the root of your startupjs project.
2. Read the source code carefully
3. Update the required env vars
4. Make script executable and run it with:

    ```
    chmod a+x ./test_deploy.sh && ./test_deploy.sh
    ```

Here is the script:

```sh
#!/bin/sh
# test_deploy.sh

# You must specify the following 3 ENV vars:

# 1. name of your app in kube.
#     This should match the label `part-of` of the deployment(s)
APP="myapp"

# 2. service principal json to access the AKS cluster:
AZURE_CREDENTIALS=$( cat ./keys/cicd_apps_account.json )

# 3. SHA of the git commit:
COMMIT_SHA="git-commit-sha"

# 4. custom images, ex: 'server:./front/Dockerfile,python:./Dockerfile' :
DEPLOYMENTS=""

# 5. optional, name of the feature for feature-branches:
FEATURE=""

# 6. optional, base domain for feature-branches' :
FEATURE_DOMAIN=""

# 6. optional, wildcard certificate for feature-branches, ex: 'true' :
FEATURE_WILDCARD=""

# Run the build and deploy your startupjs app:
#
# you have to mount the source code of your app as `/project`
# OR
# specify the path to the project source code in container with PROJECT_PATH
#
# For example Google Cloud Build mounts code automatically to `/workspace`,
# so you can pass `PROJECT_PATH=/workspace` to get things working there.
#
# When running locally you would just mount your app as a default `/project`
# and pass all env vars as in the following:
docker run -ti --rm \
  -v "${PWD}:/project" \
  -e "APP=${APP}" \
  -e "AZURE_CREDENTIALS=${AZURE_CREDENTIALS}" \
  -e "COMMIT_SHA=${COMMIT_SHA}" \
  -e "DEPLOYMENTS=${DEPLOYMENTS}" \
  -e "FEATURE=${FEATURE}" \
  -e "FEATURE_DOMAIN=${FEATURE_DOMAIN}" \
  -e "FEATURE_WILDCARD=${FEATURE_WILDCARD}" \
  startupjs/deploy-aks
```

## CI/CD integrations

Since everything is encapsulated into one docker image it's very easy to get this running on any CI/CD provider which supports `docker run` or any other way of running docker containers.

You can find some sample integrations in the `sample-cicd` folder.

To integrate with a missing CI/CD provider just get familiar with the `test_deploy.sh` script source code from the previous section.
