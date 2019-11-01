# Make will use bash instead of sh
SHELL := /usr/bin/env bash

.DEFAULT_GOAL := run

# https://stackoverflow.com/a/23324703/1930491
ROOT := $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))

DEV_IMAGE := startupjs/dev
APP_NAME := $(shell grep -m1 name package.json | awk -F: '{ print $$2 }' | sed 's/[ ",]//g')
DEV_NAME := $(APP_NAME)-dev
DB_FOLDER := $(ROOT)/data

# Speedup things on MacOS by mounting volumes using 'delegated' mode
OS_NAME := $(shell uname -s | tr A-Z a-z)
ifeq ($(OS_NAME), darwin)
  VOLUME_MODE := :delegated
else
  VOLUME_MODE :=
endif

# exec into running container
.PHONY: exec
exec:
	docker exec -it $(DEV_NAME) sh

# access yarn directly with `make yarn`. You can pass options to it.
# IMPORTANT: `-` and `--` options are not supported.
#            Instead use `make -- yarn --version` or exec into the
#            running container with `make exec` and run yarn there
# https://stackoverflow.com/a/6273809/1930491
.PHONY: yarn
yarn:
	docker inspect -f '{{.State.Running}}' $(DEV_NAME) \
	&& docker exec -it \
		$(DEV_NAME) \
		yarn $(filter-out $@,$(MAKECMDGOALS)) \
	|| docker run --rm -it \
		--name $(DEV_NAME) \
		--ulimit nofile=65535:65535 \
		-p 3000:3000 \
		-p 3010:3010 \
		-v $(DB_FOLDER):/data/db$(VOLUME_MODE) \
		-v $(ROOT):/app$(VOLUME_MODE) \
		$(DEV_IMAGE) \
		yarn $(filter-out $@,$(MAKECMDGOALS))

# start docker container for local development
.PHONY: run
run:
	docker inspect -f '{{.State.Running}}' $(DEV_NAME) \
	&& docker exec -it \
		$(DEV_NAME) \
		$(filter-out $@,$(MAKECMDGOALS)) \
	|| docker run --rm -it \
		--name $(DEV_NAME) \
		--ulimit nofile=65535:65535 \
		-p 3000:3000 \
		-p 3010:3010 \
		-v $(DB_FOLDER):/data/db$(VOLUME_MODE) \
		-v $(ROOT):/app$(VOLUME_MODE) \
		$(DEV_IMAGE) \
		$(filter-out $@,$(MAKECMDGOALS))

%:
	@:
