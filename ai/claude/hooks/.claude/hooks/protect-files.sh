#!/bin/bash
# .claude/hooks/protect-files.sh
# Bloque les modifications de fichiers sensibles (outils fichier ET commandes Bash)

INPUT=$(cat)

# Parse JSON avec node (jq pas toujours disponible sur Windows)
PARSED=$(node -e '
  let data = "";
  process.stdin.on("data", c => data += c);
  process.stdin.on("end", () => {
    try {
      const j = JSON.parse(data);
      const file = (j.tool_input && (j.tool_input.file_path || j.tool_input.path)) || "";
      const cmd = (j.tool_input && j.tool_input.command) || "";
      process.stdout.write(file + "\n" + cmd);
    } catch (e) {
      process.stdout.write("\n");
    }
  });
' <<< "$INPUT")

FILE=$(echo "$PARSED" | sed -n '1p')
COMMAND=$(echo "$PARSED" | sed -n '2,$p')

if [ -z "$FILE" ] && [ -z "$COMMAND" ]; then
  exit 0
fi

# Patterns de fichiers protégés (compatibles file_path ET ligne de commande)
PROTECTED_PATTERNS=(
  "\.env\b"
  "\.env\."
  "\.git/"
  "package-lock\.json\b"
  "yarn\.lock\b"
  "pnpm-lock\.yaml\b"
  "Gemfile\.lock\b"
  "poetry\.lock\b"
  "\.ssh/"
  "id_rsa"
  "credentials"
  "secrets/"
)

for pattern in "${PROTECTED_PATTERNS[@]}"; do
  if [ -n "$FILE" ] && echo "$FILE" | grep -Eq "$pattern"; then
    echo "🔒 Bloqué : '$FILE' est un fichier protégé." >&2
    echo "Modifie d'abord la source (.env.example, documentation, etc.) ou demande validation explicite à l'utilisateur." >&2
    exit 2
  fi
  if [ -n "$COMMAND" ] && echo "$COMMAND" | grep -Eq "$pattern"; then
    echo "🔒 Bloqué : la commande touche un fichier protégé (pattern '$pattern')." >&2
    echo "Modifie d'abord la source (.env.example, documentation, etc.) ou demande validation explicite à l'utilisateur." >&2
    exit 2
  fi
done

exit 0
