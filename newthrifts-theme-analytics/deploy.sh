#!/usr/bin/env bash

set -euo pipefail

echo "🚀 Starting deployment process..."

# Load env
if [ -f .env.shopify ]; then
  set -a
  # shellcheck disable=SC1091
  source .env.shopify
  set +a
fi

if ! command -v shopify >/dev/null 2>&1; then
  echo "❌ shopify CLI not found. Install with: npm i -g @shopify/cli @shopify/theme" >&2
  exit 127
fi

GIT_BRANCH=$(git branch --show-current 2>/dev/null || echo "")
if [ "${GIT_BRANCH}" != "main" ]; then
  echo "⚠️ Not on main (current: ${GIT_BRANCH}). Continuing anyway..."
fi

echo "📥 Pulling latest changes..."
git pull --ff-only || true

TARGET_STORE=${SHOPIFY_STORE:-}
if [ -z "${TARGET_STORE}" ]; then
  echo "❌ SHOPIFY_STORE is not set (in .env.shopify)." >&2
  exit 2
fi

# If a specific theme id is provided, deploy to that; otherwise deploy to live
if [ -n "${SHOPIFY_THEME_ID:-}" ]; then
  echo "🚀 Pushing to theme ${SHOPIFY_THEME_ID} on ${TARGET_STORE}..."
  shopify theme push --store="${TARGET_STORE}" --theme-id="${SHOPIFY_THEME_ID}" --json | cat
else
  echo "🚀 Pushing to LIVE theme on ${TARGET_STORE}..."
  shopify theme push --store="${TARGET_STORE}" --live --json | cat
fi

echo "🎉 Deployment complete!"
