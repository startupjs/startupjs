# Build and deploy startupjs app into an opinionated Hetzner cluster
#
# REQUIREMENTS:
#   a) You have to pass the following env vars:
#      - AWS_CREDENTIALS
#      - APP
#      - COMMIT_SHA
#   b) Mount the source code of your app as `/project`
#      You can configure project path in container by passing env var PROJECT_PATH

FROM alpine:3

#ENV container docker
ENV PATH=$PATH:/root/.krew/bin

WORKDIR /

RUN apk add jq curl git

# Copy the main script with all the commands
COPY entrypoint.sh /

# Run 'init' step
RUN ["/bin/sh", "/entrypoint.sh", "init"]

ENTRYPOINT ["/entrypoint.sh"]

# Run all other steps as a batch job to perform the actual deployment
CMD ["batch"]
