FROM alpine:3.10

VOLUME /app /data/db
EXPOSE 3000 3010 27017 28017 6379

WORKDIR /app

RUN \
  echo "@v3.9.community http://dl-cdn.alpinelinux.org/alpine/v3.9/community" >> /etc/apk/repositories && \
  echo "@v3.9 http://dl-cdn.alpinelinux.org/alpine/v3.9/main" >> /etc/apk/repositories && \
  apk upgrade --update && \
  apk add --no-cache yaml-cpp@v3.9 boost-filesystem@v3.9 boost-iostreams@v3.9 boost-program_options@v3.9 boost-system@v3.9 && \
  apk add --no-cache mongodb@v3.9.community && \
  apk add --no-cache redis nodejs yarn make gcc g++ python git && \
  yarn global add concurrently

# Install node_modules and run DBs in background
COPY docker-entrypoint.sh /usr/local/bin/
ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["concurrently", "-s", "first", "-k", "-n", "S,W", "-c", "black.bgWhite,cyan.bgBlue", "yarn server", "yarn web"]
