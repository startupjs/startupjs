FROM node:21.2-alpine

# REQUIRED ENV VARS:
# - STAGE
# - MONGO_URL
# - REDIS_URL

ADD . /app
WORKDIR /app

RUN \
  apk add --no-cache make gcc g++ python3 git && \
  yarn && \
  cd styleguide && \
  yarn build && \
  apk del make gcc g++ python3 git

WORKDIR /app/styleguide
CMD yarn start-production

EXPOSE 3000
