cat models.json | jq -r '.data | sort_by(.created) | reverse | .[] | "\(.name): \(.description)"'
