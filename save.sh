#!/bin/bash

set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage: $0 <name>"
  exit 1
fi

NAME="$1"
DIR="history"
DATE=$(date +"%Y-%m-%dT%H:%M:%S")
FILE="$DIR/${DATE}-$NAME.md"

mkdir -p "$DIR"

{
  echo -e "\`user:\`\n"
  cat prompt.md
  echo -e "\n\n\`assistant:\`\n"
  cat response.md
} >> "$FILE"
