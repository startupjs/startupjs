FROM node:14.20-alpine

# REQUIRED ENV VARS:
# - STAGE
# - MONGO_URL
# - REDIS_URL

ADD . /app
WORKDIR /app

RUN \
  # install build tools
  apk add --no-cache make gcc g++ python3 git && \
  # install dependencies
  yarn && \
  # build production bundles of server and web
  yarn build && \
  # cleanup build tools
  apk del make gcc g++ python3 git

CMD yarn start-production

EXPOSE 3000
