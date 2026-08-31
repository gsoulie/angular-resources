[Back](https://github.com/gsoulie/angular-resources/blob/master/ai/ai-anthropic.md#hooks)    
# Exemple de 3 hooks utiles combinés
Voici le `settings.json` complet qui active les 4 hooks d'un coup

Copier ce JSON dans le répertoire `.claude/settings.json`, puis placer les trois scripts (guard-bash.sh, protect-files.sh, session-context.sh) dans `.claude/hooks/` et les rendre exécutables avec `chmod +x .claude/hooks/*.sh`

# Détail
* Hook #1 : Injecte le contexte projet dans la session au démarrage du projet
* Hook #2 : bloquer les commandes destructrices type `rm`, `DROP TABLE`...
* Hook #3 : protéger les fichiers sensibles de toute modification
* Hook #4 : Prettier installé localement (pnpm add -D prettier, ou npm / yarn).
