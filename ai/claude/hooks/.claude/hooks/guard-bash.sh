#!/bin/bash
# .claude/hooks/guard-bash.sh
# Bloque les commandes destructrices avant exécution

COMMAND=$(cat)

# Patterns à bloquer (ajoute ce qui te concerne)
BLOCKED_PATTERNS=(
  "rm -rf /"
  "rm -rf \*"
  "rm -rf ~"
  "rm -rf \\$HOME"
  "git push --force"
  "git push -f "
  "git reset --hard origin"
  "DROP TABLE"
  "DROP DATABASE"
  "TRUNCATE"
  "chmod -R 777"
  "> /dev/sda"
  "mkfs"
  "dd if="
)

for pattern in "${BLOCKED_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qi "$pattern"; then
    echo "❌ Bloqué : la commande contient le pattern dangereux '$pattern'." >&2
    echo "Propose une alternative non destructive, ou explique pourquoi cette commande est nécessaire et demande validation explicite." >&2
    exit 2
  fi
done

exit 0
