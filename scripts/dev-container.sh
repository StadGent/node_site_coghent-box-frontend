#!/bin/bash
set -a

__DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

DOCKER=docker
if [ -x "$(command -v podman)" ]; then
  DOCKER=podman
fi

${DOCKER} run -it --rm -v ${__DIR}:/app -p ${1:8080}:8080 --env-file=.env.local coghent-web-portal:dev $@
