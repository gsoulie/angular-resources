#!/bin/bash
# .claude/hooks/session-context.sh
# Injecte le contexte projet au démarrage de session

BRANCH=$(git branch --show-current 2>/dev/null || echo "n/a")
LAST_COMMIT=$(git log -1 --oneline 2>/dev/null || echo "n/a")
MODIFIED=$(git status --short 2>/dev/null | head -10)

CONTEXT="## Contexte de session

**Branche actuelle** : $BRANCH
**Dernier commit** : $LAST_COMMIT

**Fichiers modifiés non commit** :
\`\`\`
${MODIFIED:-(aucun)}
\`\`\`
"

# Échappe la chaîne pour l'inclure dans du JSON (backslash, guillemets, retours à la ligne)
escape_json() {
  local s=$1
  s=${s//\\/\\\\}
  s=${s//\"/\\\"}
  s=${s//$'\n'/\\n}
  s=${s//$'\r'/\\r}
  s=${s//$'\t'/\\t}
  printf '%s' "$s"
}

ESCAPED=$(escape_json "$CONTEXT")

printf '{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"%s"}}\n' "$ESCAPED"

exit 0
