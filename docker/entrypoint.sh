#!/bin/sh

set -e

echo "Starting frontend"
npm install -g @vue/cli &&
npm link ./coghent-vue-3-component-library &&
exec npm run serve