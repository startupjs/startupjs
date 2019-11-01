#!/bin/sh
set -e

if [ "$1" = "concurrently" ]; then
  # Run MongoDB in background
  mongod --bind_ip 0.0.0.0 --nojournal &

  # Run Redis in background
  redis-server &
fi

exec "$@"
