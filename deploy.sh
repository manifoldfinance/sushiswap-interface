#!/usr/bin/env bash

set -o errexit

check_mark="\033[1;32m✔\033[0m"
header() { echo -e "\n\033[1m$1\033[0m"; }

header "Nextjs Production Deployment\n"
echo "Enviornment configuration..."
export NEXT_TELEMETRY_DISABLED=1
export CI=''
export NODE_OPTIONS='--max-old-space-size=4096'
echo "Sanity check..."
echo $NEXT_TELEMETRY_DISABLED
echo -e "\033[1A ${check_mark} Configured enviornment ... passing"
sleep 1
echo "Installing..."
yarn install --frozen-lockfile
echo -e "\033[1A ${check_mark} Install ... done"
echo "Building..."
node --expose-gc node_modules/.bin/next build
sleep 1
node atomic.cjs
echo -e "\033[1A ${check_mark} Building ... done"


echo -e " \033[1mDeployment build finished\033[0m"

exit 0