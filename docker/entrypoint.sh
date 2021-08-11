#!/bin/sh

set -e

echo "Starting frontend"
npm install -g @vue/cli 
exec npm run serve