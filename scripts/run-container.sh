#!/bin/bash
DOCKER=docker
if [ -x "$(command -v podman)" ]; then
  DOCKER=podman
fi

${DOCKER} run -it --rm -p ${1:8080}:8080 --env-file=.env.local coghent-web-portal:prod $@
