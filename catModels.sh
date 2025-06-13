cat models.json | jq '.data | sort_by(.created) | reverse | .[].name'
