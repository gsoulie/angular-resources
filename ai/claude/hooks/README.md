[Back](https://github.com/gsoulie/angular-resources/blob/master/ai/ai-anthropic.md#hooks)    
# Tout en un : les 5 hooks combinés
Voici le `settings.json` complet qui active les 4 hooks d'un coup

Copier ce JSON dans le répertoire `.claude/settings.json`, puis placer les trois scripts (guard-bash.sh, protect-files.sh, session-context.sh) dans `.claude/hooks/` et les rendre exécutables avec `chmod +x .claude/hooks/*.sh`

# Prérequis
* Hook #2 : bash.
* Hook #3 : Prettier installé localement (pnpm add -D prettier, ou npm / yarn).
* Hook #4 : bash + Node.js (utilisé pour parser le JSON sans dépendre de jq).
* Hook #5 : bash + git.
Sur Windows, bash est dispo via Git Bash (livré avec Git for Windows) ou WSL.
