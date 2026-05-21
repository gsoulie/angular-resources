# Constitution d’Ingénierie Frontend

## Objectif

Cette constitution définit les standards d’ingénierie, les principes d’architecture, les exigences de qualité et les pratiques de développement obligatoires pour toutes les applications frontend développées dans ce dépôt.

L’objectif est de garantir :
- des bases de code maintenables et évolutives
- l’utilisation des bonnes pratiques Angular modernes
- un haut niveau d’accessibilité
- une architecture prévisible et cohérente
- des standards de tests robustes
- une évolutivité long terme
- une expérience développeur homogène

Tous les contributeurs, agents IA et outils de génération de code automatisés DOIVENT respecter cette constitution.

---

# 1. Principes Fondamentaux d’Ingénierie

## 1.1 Simplicité avant tout

La base de code DOIT privilégier :
- la simplicité
- la lisibilité
- l’explicite
- la maintenabilité

À éviter :
- l’optimisation prématurée
- la sur-ingénierie
- les abstractions inutiles
- les effets de bord cachés
- les chaînes réactives complexes lorsqu’une solution plus simple existe

Chaque implémentation DEVRAIT être compréhensible par un autre développeur en quelques minutes.

---

## 1.2 Principes SOLID

Toute l’architecture frontend et les implémentations DOIVENT respecter les principes SOLID :

- Single Responsibility Principle
- Open/Closed Principle
- Liskov Substitution Principle
- Interface Segregation Principle
- Dependency Inversion Principle

Les composants, services, stores et utilitaires DOIVENT avoir des responsabilités clairement définies.

---

## 1.3 DRY & KISS

La base de code DOIT :
- éviter la duplication de logique
- centraliser les comportements réutilisables
- privilégier de petites unités focalisées
- maintenir des API et abstractions minimales

Le principe KISS prévaut sur la généricité inutile.

---

## 1.4 Évolutivité

L’architecture DOIT permettre :
- des livraisons incrémentales
- des refactorings isolés
- une modularisation par domaine
- une évolution indépendante des fonctionnalités
- une forte testabilité
- une scalabilité adaptée aux grandes équipes

L’application DOIT éviter les modules fortement couplés.

---

# 2. Standards Angular

## 2.1 Version Angular

L’application DOIT utiliser la dernière version stable d’Angular.

APIs Angular modernes obligatoires :
- standalone components
- signals
- computed
- effect
- inject()
- nouvelle syntaxe de contrôle (@if, @for, @switch)
- lazy loading au niveau des routes
- guards/interceptors fonctionnels lorsque pertinent

Les NgModules NE DEVRAIENT PAS être utilisés sauf obligation liée à une dépendance tierce.

---

## 2.2 Gestion Réactive de l’État

Les Signals DOIVENT être le mécanisme réactif par défaut.

RxJS DEVRAIT uniquement être utilisé pour :
- les flux asynchrones
- les interactions événementielles
- les appels API
- les websockets ou flux continus

À éviter :
- les chaînes d’observables inutiles
- les subscriptions imbriquées
- la gestion impérative des subscriptions

À privilégier :
- l’état basé sur les signals
- les computed
- les mises à jour immuables

---

## 2.3 Conception des Composants

Les composants DOIVENT :
- être petits et focalisés
- avoir une responsabilité unique
- éviter la logique métier dans les templates
- limiter les inputs/outputs excessifs
- exposer une API publique minimale

La séparation smart/presentational DEVRAIT être appliquée lorsque la complexité augmente.

---

## 2.4 Injection de Dépendances

Utiliser `inject()` plutôt que l’injection par constructeur sauf impossibilité technique.

Les dépendances DOIVENT :
- rester explicites
- éviter le pattern service locator
- éviter les dépendances circulaires

---

## 2.5 Routing

Le routing DOIT :
- utiliser le lazy loading par défaut
- isoler les fonctionnalités par domaine
- limiter l’état global partagé

Les guards et resolvers DOIVENT rester légers.

---

# 3. Standards UI & Design System

## 3.1 Stack UI

Technologies UI obligatoires :
- TailwindCSS
- Angular Material

Angular Material DOIT être personnalisé via :
- des design tokens
- un système de thème centralisé
- des règles de style homogènes

L’utilisation des classes Tailwind DOIT rester lisible et maintenable.

---

## 3.2 Cohérence Visuelle

L’interface DOIT garantir :
- une cohérence visuelle
- un design responsive
- une compatibilité mobile-first
- des patterns UI réutilisables
- une homogénéité des espacements et typographies

À éviter :
- les styles inline
- les duplications de logique CSS
- les divergences visuelles non contrôlées

---

## 3.3 Accessibilité

La conformité accessibilité est obligatoire.

L’application DOIT respecter :
- WCAG 2.1 niveau AA
- les exigences RGAA
- l’European Accessibility Act (EAA)

Exigences minimales :
- navigation clavier complète
- gestion visible du focus
- HTML sémantique
- usage approprié des attributs ARIA
- contraste suffisant
- compatibilité lecteurs d’écran
- formulaires accessibles
- modales et overlays accessibles

L’accessibilité DOIT être intégrée dès la conception.

Toute violation d’accessibilité est considérée comme bloquante.

---

# 4. Standards d’Architecture

## 4.1 Architecture par Domaine Fonctionnel

L’application DOIT suivre une architecture orientée fonctionnalités/domaines.

Structure recommandée :
- core
- shared
- features
- layout
- design-system
- infrastructure

Les domaines métiers DOIVENT rester isolés.

---

## 4.2 Code Partagé

Le code partagé DOIT :
- rester générique
- éviter les fuites métier
- exposer des API stables

Les modules shared NE DOIVENT PAS devenir des zones de dépôt sans gouvernance.

---

## 4.3 Propriété de l’État

La responsabilité des états DOIT rester explicite.

Règles :
- l’état UI local reste local
- l’état métier reste dans la feature
- l’état global doit rester minimal

Éviter les stores globaux inutiles.

---

## 4.4 Couche API

Les communications API DOIVENT :
- être centralisées
- fortement typées
- découplées de l’UI
- gérer les erreurs de manière cohérente

Les DTOs NE DEVRAIENT PAS être utilisés directement dans les composants UI.

---

# 5. Standards de Qualité de Code

## 5.1 Règles TypeScript

Le mode strict TypeScript est obligatoire.

Interdits :
- `any`
- assertions de type dangereuses
- typage implicite
- état mutable partagé

À privilégier :
- readonly
- discriminated unions
- contrats explicites
- typage fort

---

## 5.2 Conventions de Nommage

Les noms DOIVENT être :
- explicites
- orientés métier
- cohérents
- révélateurs d’intention

Éviter les abréviations ambiguës.

---

## 5.3 Commentaires

Les commentaires DEVRAIENT expliquer :
- le pourquoi
- l’intention métier
- les décisions non évidentes

Les commentaires NE DOIVENT PAS expliquer du code évident.

Le code commenté mort est interdit.

---

## 5.4 Gestion des Erreurs

Les erreurs DOIVENT :
- être gérées explicitement
- fournir des messages utiles
- éviter les échecs silencieux

Les erreurs UI DOIVENT rester compréhensibles pour les utilisateurs.

Les détails techniques NE DOIVENT PAS fuiter côté utilisateur.

---

# 6. Standards de Tests

## 6.1 Framework de Test

Vitest est obligatoire pour les tests unitaires et d’intégration.

---

## 6.2 Stratégie de Test

L’application DOIT privilégier :
- les tests unitaires
- les tests de composants
- les tests d’intégration

Les tests DOIVENT couvrir :
- les comportements métier
- les comportements d’accessibilité
- les cas limites
- les scénarios d’erreur

---

## 6.3 Philosophie de Test

Les tests DOIVENT :
- rester lisibles
- éviter le couplage à l’implémentation
- valider le comportement observable
- rester déterministes

Éviter les tests fragiles.

---

## 6.4 Couverture Critique

La logique métier critique DOIT être couverte par des tests automatisés.

Zones prioritaires :
- règles métier
- gestion d’état
- formulaires
- permissions
- interactions critiques d’accessibilité

---

# 7. Standards de Performance

## 7.1 Performance Frontend

L’application DOIT :
- minimiser la taille des bundles
- lazy loader les fonctionnalités
- éviter les rerenders inutiles
- optimiser la détection de changements
- limiter le travail bloquant au rendu

Les signals DEVRAIENT être privilégiés pour une réactivité fine.

---

## 7.2 Rendu

À éviter :
- les calculs coûteux dans les templates
- les logiques de rendu dupliquées
- les mises à jour DOM inutiles

Les valeurs calculées DEVRAIENT être mémoïsées via les signals Angular.

---

# 8. Standards de Sécurité

Les applications frontend DOIVENT :
- prévenir les vulnérabilités XSS
- éviter les manipulations DOM dangereuses
- sanitiser les contenus dynamiques
- protéger les données sensibles
- limiter l’exposition des secrets côté client

La validation frontend seule n’est jamais suffisante.

---

# 9. Expérience Développeur

Le projet DOIT fournir :
- un linting cohérent
- un formatage automatisé
- un développement local rapide
- des builds déterministes
- un onboarding clair
- des environnements reproductibles

Les pipelines CI DOIVENT valider :
- le lint
- les tests
- le typage
- les contrôles d’accessibilité
- l’intégrité du build

---

# 10. Documentation

Toute fonctionnalité significative DOIT inclure :
- son intention architecturale
- la documentation de son API publique
- des exemples d’usage lorsque pertinent
- les raisons des décisions complexes

Les ADR (Architecture Decision Records) DEVRAIENT être utilisés pour les décisions majeures.

---

# 11. Règles sur le Code Généré par IA

Le code généré par IA DOIT :
- respecter intégralement cette constitution
- rester compréhensible humainement
- éviter les APIs hallucinéées
- éviter la complexité inutile
- inclure un typage correct
- inclure des tests lorsque pertinent

Le code généré DOIT être relu avant fusion.

---

# 12. Definition of Done

Une fonctionnalité est considérée terminée uniquement si :
- le code compile correctement
- les tests passent
- les exigences d’accessibilité sont validées
- le lint passe
- les règles d’architecture sont respectées
- la documentation est mise à jour
- aucune dette technique critique n’est introduite

---

# 13. Règles Non Négociables

Les éléments suivants sont strictement interdits :
- l’utilisation de `any`
- les composants monolithiques
- la logique métier dans les templates
- la duplication de logique métier
- les composants UI non accessibles
- le code mort
- le code commenté
- les effets de bord cachés
- le couplage fort entre fonctionnalités
- le contournement du typage strict
- le contournement des exigences d’accessibilité

---

# 14. Philosophie Directrice

L’architecture frontend DOIT prioriser :
1. L’accessibilité
2. La simplicité
3. La maintenabilité
4. L’évolutivité
5. L’expérience développeur
6. La performance
7. La cohérence

La rapidité court terme NE DOIT JAMAIS compromettre la maintenabilité long terme.
