# Build and deploy startupjs app into an opinionated AKS cluster
#
# REQUIREMENTS:
#   a) You have to pass the following env vars:
#      - AWS_CREDENTIALS
#      - APP
#      - COMMIT_SHA
#   b) Mount the source code of your app as `/project`
#      You can configure project path in container by passing env var PROJECT_PATH

# Kaniko binaries are used to build the image
# ref: https://stackoverflow.com/a/69251129
FROM docker:stable-dind

# aws-cli
ENV AWSCDK_VERSION=2.89.0
ENV GLIBC_VER=2.34-r0
# override aws-cli v2 default pager
ENV AWS_PAGER=""

# RUN apk update && apk upgrade
RUN apk add --no-cache --update python3 python3-dev git jq

#pip3 needs to be run initialy to upgrade pip
RUN python3 -m ensurepip
RUN pip3 install --upgrade pip
RUN pip3 install boto3 \
  json-spec \
  yamllint

# https://github.com/aws/aws-cli/issues/4685#issuecomment-615872019
# install glibc compatibility for alpine
RUN apk --no-cache add \
        binutils \
        curl \
    && curl -sL https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub -o /etc/apk/keys/sgerrand.rsa.pub \
    && curl -sLO https://github.com/sgerrand/alpine-pkg-glibc/releases/download/${GLIBC_VER}/glibc-${GLIBC_VER}.apk \
    && curl -sLO https://github.com/sgerrand/alpine-pkg-glibc/releases/download/${GLIBC_VER}/glibc-bin-${GLIBC_VER}.apk \
    && apk add --force-overwrite --no-cache \
        glibc-${GLIBC_VER}.apk \
        glibc-bin-${GLIBC_VER}.apk \
    && curl -sL https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip -o awscliv2.zip \
    && unzip awscliv2.zip \
    && aws/install \
    && rm -rf \
        awscliv2.zip \
        aws \
        /usr/local/aws-cli/v2/*/dist/aws_completer \
        /usr/local/aws-cli/v2/*/dist/awscli/data/ac.index \
        /usr/local/aws-cli/v2/*/dist/awscli/examples \
    && apk --no-cache del \
        binutils \
        curl \
    && rm glibc-${GLIBC_VER}.apk \
    && rm glibc-bin-${GLIBC_VER}.apk \
    && rm -rf /var/cache/apk/*

# RUN npm i --location=global npm
# RUN npm i --location=global aws-cdk@${AWSCDK_VERSION}


# # Azure CLI is the main binary so it makes sense to just use as the base image
# FROM robertd/alpine-aws-cdk

# # Add kaniko to this image by re-using binaries and steps from official image
# COPY --from=kaniko /kaniko/executor /kaniko/executor
# COPY --from=kaniko /kaniko/docker-credential-gcr /kaniko/docker-credential-gcr
# COPY --from=kaniko /kaniko/docker-credential-ecr-login /kaniko/docker-credential-ecr-login
# COPY --from=kaniko /kaniko/docker-credential-acr /kaniko/docker-credential-acr
# COPY --from=kaniko /etc/nsswitch.conf /etc/nsswitch.conf
# COPY --from=kaniko /kaniko/.docker /kaniko/.docker
ENV PATH $PATH:/root/.krew/bin

# ENV DOCKER_CONFIG /kaniko/.docker/
# ref: https://github.com/GoogleContainerTools/kaniko/issues/1542#issuecomment-853929795
# ENV container docker

ENV DOCKER_BUILDKIT 1

WORKDIR /root

RUN apk add jq curl

# Copy the main script with all the commands
COPY entrypoint.sh /

# Run 'init' step
RUN ["/bin/sh", "/entrypoint.sh", "init"]

ENTRYPOINT ["/entrypoint.sh"]

# Run all other steps as a batch job to perform the actual deployment
CMD ["batch"]
