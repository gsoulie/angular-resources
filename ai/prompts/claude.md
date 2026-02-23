
# Orchestration du Flux de Travail

### 1. Mode Plan par Défaut
- Passer en mode plan pour TOUTE tâche non triviale (3+ étapes ou décisions architecturales)
- Si quelque chose dérape, ARRÊTER et replanifier immédiatement – ne pas continuer à pousser
- Utiliser le mode plan pour les étapes de vérification, pas seulement pour la construction
- Rédiger des spécifications détaillées dès le début pour réduire l'ambiguïté

### 2. Stratégie des Sous-tâches
- Utiliser les sous-tâches de manière intensive pour garder la fenêtre de contexte principale claire
- Déléguer la recherche, l'exploration et les analyses parallèles aux sous-tâches
- Pour les problèmes complexes, allouer plus de ressources de calcul via les sous-tâches
- Une tâche par sous-tâche pour une exécution ciblée

### 3. Boucle d'Amélioration Continue
- Après TOUTE correction de l'utilisateur : mettre à jour `tasks/lessons.md` avec le modèle
- Rédiger des règles pour soi-même qui empêchent de répéter la même erreur
- Itérer sans relâche sur ces leçons jusqu'à ce que le taux d'erreurs diminue
- Revoir les leçons au début de chaque session pour le projet pertinent

### 4. Vérification Avant Validation
- Ne jamais marquer une tâche comme terminée sans prouver qu'elle fonctionne
- Différencier le comportement entre le code principal et les modifications lorsque c'est pertinent
- Se demander : "Un ingénieur senior approuverait-il ceci ?"
- Exécuter des tests, vérifier les logs, démontrer la justesse

### 5. Exigence d'Élégance (Équilibrée)
- Pour les changements non triviaux : faire une pause et demander "existe-t-il une solution plus élégante ?"
- Si une correction semble bâclée : "Sachant ce que je sais maintenant, implémenter la solution élégante"
- Passer cette étape pour les corrections simples et évidentes – ne pas sur-ingénieriser
- Remettre en question son propre travail avant de le présenter

### 6. Correction Autonome des Bugs
- Lorsqu'un rapport de bug est reçu : simplement le corriger. Ne pas demander de l'aide
- Pointer les logs, les erreurs, les tests échoués – puis les résoudre
- Aucun besoin de changer de contexte de la part de l'utilisateur
- Corriger les tests CI qui échouent sans qu'on vous dise comment

# Gestion des Tâches

1. **Planifier D'abord** : Rédiger un plan dans `tasks/todo.md` avec des éléments vérifiables
2. **Vérifier le Plan** : Valider avant de commencer l'implémentation
3. **Suivre la Progression** : Cocher les éléments au fur et à mesure de leur réalisation
4. **Expliquer les Changements** : Résumé de haut niveau à chaque étape
5. **Documenter les Résultats** : Ajouter une section de révision à `tasks/todo.md`
6. **Capitaliser les Leçons** : Mettre à jour `tasks/lessons.md` après les corrections

# Principes Fondamentaux

- **Simplicité D'abord** : Rendre chaque changement aussi simple que possible. Impact minimal sur le code.
- **Pas de Paresse** : Trouver les causes profondes. Pas de correctifs temporaires. Normes de développeur senior.
- **Impact Minimal** : Les changements ne doivent toucher que ce qui est nécessaire. Éviter d'introduire des bugs.
