#!/bin/bash

# Vercel Ignored Build Step Script
# Exit code 1: Proceed with build (important files changed)
# Exit code 0: Cancel build (only docs/unrelated files changed)

PREV_SHA=${VERCEL_GIT_PREVIOUS_SHA}
CURR_SHA=${VERCEL_GIT_COMMIT_SHA:-HEAD}

if [ -z "$PREV_SHA" ]; then
  echo "No previous SHA available. Continuing build by default."
  exit 1
fi

echo "Checking for changes between $PREV_SHA and $CURR_SHA..."

git diff --quiet $PREV_SHA $CURR_SHA -- \
  index.html \
  src/ \
  public/ \
  api/ \
  server/ \
  package.json \
  package-lock.json \
  vite.config.js \
  vercel.json

DIFF_EXIT_CODE=$?

if [ $DIFF_EXIT_CODE -eq 0 ]; then
  echo "No important files changed. Skipping build."
  exit 0
else
  echo "Important files changed or diff failed. Proceeding with build."
  exit 1
fi
