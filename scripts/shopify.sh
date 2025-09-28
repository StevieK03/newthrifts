#!/usr/bin/env bash

set -euo pipefail

# Load env if present
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

# Pass all args to Shopify CLI
shopify "$@" | cat

