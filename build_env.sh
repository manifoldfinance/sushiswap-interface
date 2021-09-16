#!/usr/bin/env bash
set -eo pipefail

# disable CI makes node_env production
set +a
export CI=''
export NODE_ENV='production'
export NEXT_PUBLIC_GOOGLE_ANALYTICS='UA-194716744-3'
export SENTRY_DSN=https://42e4822f8fa143608a11c22a2513c7e2@o418752.ingest.sentry.io/5962000
export NEXT_PUBLIC_SENTRY_DSN=https://42e4822f8fa143608a11c22a2513c7e2@o418752.ingest.sentry.io/5962000
set -a

yarn install --silent
npx next build

echo "Configuring RPC Connections"
DEFAULT_RPC_URI='https://api.sushirelay.com/v1'

if [[ -n "${MANIFOLD_FINANCE_RPC_URI}" ]]; then
    echo "Replacing default RPC URI value with '${MANIFOLD_FINANCE_RPC_URI}' ..."
    find .next/static/chunks .next/server/chunks -type f -exec sed -i -e "s|${DEFAULT_RPC_URI}|${MANIFOLD_FINANCE_RPC_URI}|g" {} \;
fi
