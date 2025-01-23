#!/usr/bin/env bash

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Source the .env file
if [ -f "${SCRIPT_DIR}/../.env" ]; then
  export $(grep -v '^#' "${SCRIPT_DIR}/../.env" | xargs)
fi

docker stop "${NAME}" || true

# docker run -it --rm -d \
docker run -it --rm \
  --name "${NAME}" \
  --network "${NETWORK_NAME}" \
  --env-file "${SCRIPT_DIR}/../.env" \
  -v "${SCRIPT_DIR}/../.ssh:/root/.ssh" \
   "${IMAGE_TAG}"