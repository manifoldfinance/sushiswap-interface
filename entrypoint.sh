#!/usr/bin/env bash
set -eo pipefail

echo "Configuring env variables..."
export CI=''
export HUSKY=0
export NEXT_TELEMETRY_DISABLED=1

echo "Configuring RPC Connections"
DEFAULT_RPC_URI='https://api.sushirelay.com/v1'

yarn install
yarn run lingui
npx next build

if [[ -n "${MANIFOLD_FINANCE_RPC_URI}" ]]; then
echo "Replacing default RPC URI value with '${MANIFOLD_FINANCE_RPC_URI}' ..."
find .next/static/chunks .next/server/chunks -type f -exec sed -i -e "s|${DEFAULT_RPC_URI}|${MANIFOLD_FINANCE_RPC_URI}|g" {} \;
fi

sleep 1

echo "Executing NextJS server..."
yarn start
