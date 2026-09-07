#!/usr/bin/env bash
# Build the traces and start the Vite dev server on http://localhost:5173
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# Node may live under nvm and not be on PATH in non-interactive shells.
if ! command -v npm >/dev/null 2>&1; then
  NVM_BIN="$(ls -d "$HOME"/.nvm/versions/node/*/bin 2>/dev/null | tail -1 || true)"
  if [ -n "$NVM_BIN" ]; then
    export PATH="$NVM_BIN:$PATH"
  fi
fi

echo "==> Building traces"
python3 build.py

echo "==> Starting dev server"
cd "$ROOT/site"
npm run dev
