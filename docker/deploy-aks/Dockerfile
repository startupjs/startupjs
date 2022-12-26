# Build and deploy startupjs app into an opinionated AKS cluster
#
# REQUIREMENTS:
#   a) You have to pass the following env vars:
#      - AZURE_CREDENTIALS
#      - APP
#      - COMMIT_SHA
#   b) Mount the source code of your app as `/project`
#      You can configure project path in container by passing env var PROJECT_PATH

# Kaniko binaries are used to build the image
# ref: https://stackoverflow.com/a/69251129
FROM gcr.io/kaniko-project/executor:v1.7.0 AS kaniko

# Azure CLI is the main binary so it makes sense to just use as the base image
FROM mcr.microsoft.com/azure-cli

# Add kaniko to this image by re-using binaries and steps from official image
COPY --from=kaniko /kaniko/executor /kaniko/executor
COPY --from=kaniko /kaniko/docker-credential-gcr /kaniko/docker-credential-gcr
COPY --from=kaniko /kaniko/docker-credential-ecr-login /kaniko/docker-credential-ecr-login
COPY --from=kaniko /kaniko/docker-credential-acr /kaniko/docker-credential-acr
COPY --from=kaniko /etc/nsswitch.conf /etc/nsswitch.conf
COPY --from=kaniko /kaniko/.docker /kaniko/.docker
ENV PATH $PATH:/kaniko:/root/.krew/bin

ENV DOCKER_CONFIG /kaniko/.docker/
# ref: https://github.com/GoogleContainerTools/kaniko/issues/1542#issuecomment-853929795
ENV container docker

WORKDIR /

# Copy the main script with all the commands
COPY entrypoint.sh /

# Run 'init' step
RUN ["/bin/sh", "/entrypoint.sh", "init"]

ENTRYPOINT ["/entrypoint.sh"]

# Run all other steps as a batch job to perform the actual deployment
CMD ["batch"]
