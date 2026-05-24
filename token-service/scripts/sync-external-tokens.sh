#!/usr/bin/env zsh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"
TARGET_SCSS_DIR="${ROOT_DIR}/src/scss/base"

# Accept optional first argument as path to dp-dls-global-tokens repo.
# Defaults to the expected sibling directory layout.
TOKENS_REPO="${1:-${ROOT_DIR}/../dp-dls-global-tokens}"
TOKENS_REPO="$(cd "${TOKENS_REPO}" && pwd)"
DIST_SCSS_DIR="${TOKENS_REPO}/packages/tokens/dist/scss"

echo "[sync-external-tokens] Tokens repo:  ${TOKENS_REPO}"
echo "[sync-external-tokens] Dist SCSS dir: ${DIST_SCSS_DIR}"

if [ ! -d "${TOKENS_REPO}" ]; then
  echo "Tokens repo not found at: ${TOKENS_REPO}" >&2
  echo "Usage: $0 [path/to/dp-dls-global-tokens]" >&2
  exit 1
fi

if [ ! -d "${DIST_SCSS_DIR}" ]; then
  echo "Dist SCSS directory not found (tokens not yet compiled): ${DIST_SCSS_DIR}" >&2
  echo "Build the tokens first:" >&2
  echo "  cd ${TOKENS_REPO}/packages/tokens && npm install && npm run compile" >&2
  exit 2
fi

mkdir -p "${TARGET_SCSS_DIR}/external-tokens" || true

echo "Syncing SCSS token artifacts (preserving hand-crafted _breakpoints.scss)..."
# IMPORTANT: --exclude '_breakpoints.scss' — assets version is hand-crafted with a working
# generateBreakpointVariables() mixin. The tokens dist version has a bug (empty mixin name).
rsync -a --delete \
  --exclude '_breakpoints.scss' \
  "${DIST_SCSS_DIR}/" \
  "${TARGET_SCSS_DIR}/external-tokens/"

echo "Done. Sync complete — _breakpoints.scss was preserved."
echo "Next step: run the assets webpack build (npm run build) to produce dist/."
