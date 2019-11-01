#!/bin/sh
set -e

if [ "$1" = "install" ]; then
  yarn
  exit
fi

if [ "$1" = "concurrently" ] || [ "$1" = "sh-init" ]; then
  # Run MongoDB in background
  mongod --bind_ip 0.0.0.0 --nojournal &

  # Run Redis in background, disable any persistance
  redis-server --save "" --appendonly no &
fi

if [ "$1" = "sh-init" ]; then
  sh
  exit
fi

exec "$@"
