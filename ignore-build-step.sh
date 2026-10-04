#!/bin/bash

# Vercel Ignored Build Step Script
# Exit code 1: Proceed with build (important files changed)
# Exit code 0: Cancel build (only docs/unrelated files changed)

PREV_SHA=${VERCEL_GIT_PREVIOUS_SHA:-HEAD^}
CURR_SHA=${VERCEL_GIT_COMMIT_SHA:-HEAD}

echo "Checking for changes between $PREV_SHA and $CURR_SHA..."

git diff --quiet $PREV_SHA $CURR_SHA -- \
  src/ \
  public/ \
  api/ \
  server/ \
  package.json \
  package-lock.json \
  vite.config.js \
  vercel.json

# git diff --quiet returns 1 if there are differences, 0 if no differences
if [ $? -eq 1 ]; then
  echo "✅ Important files changed. Proceeding with build."
  exit 1
else
  echo "🛑 No important files changed. Skipping build."
  exit 0
fi
