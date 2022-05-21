#!/usr/bin/env bash

# Use this script to only deploy production builds
# https://vercel.com/docs/platform/projects#ignored-build-step
# https://vercel.com/support/articles/how-do-i-use-the-ignored-build-step-field-on-vercel#with-a-script

# runs with Makefile to generate hash on CI
# shellcheck disable=SC2034
SCRIPT_COMMIT_SHA="${LOAD_SCRIPT_COMMIT_SHA}"
# LOAD_SCRIPT_COMMIT_SHA='$(shell git rev-parse HEAD)' envsubst '$(addprefix $$,$(ENVSUBST_VARS))' < $< > $@

echo "VERCEL_ENV: $VERCEL_ENV"

if [[ "$VERCEL_ENV" == "production" ]] ; then
  # Proceed with the build
  echo "✅ - Build can proceed"
  HASH_VERSION=$(git rev-parse --short HEAD 2>/dev/null || find * -type f -name '*.go' -print0 | sort -z | xargs -0 sha1sum | sha1sum | sed -r 's/[^\da-f]+//g')
  echo $HASH_VERSION
  export $HASH_VERSION
  yarn install
  export NODE_ENV='production'
  npx next build
  exit 1;

else
  # Don't build
  echo "🛑 - Build cancelled"
  exit 0;
fi



echo "ERROR: Command not found"
exit 127
