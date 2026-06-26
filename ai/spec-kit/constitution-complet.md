````markdown
# Constitution d'Ingénierie Logicielle

## Préambule

Cette constitution définit les principes obligatoires applicables à tout développement logiciel réalisé dans le cadre des projets.

Toute spécification, plan technique, génération de code, revue de code ou contribution automatisée par un agent IA doit respecter les principes énoncés dans ce document.

En cas de conflit entre une spécification fonctionnelle et cette constitution, la constitution prévaut.

---

# Principe 1 : Conformité by Design

La conformité réglementaire, contractuelle et normative doit être intégrée dès la phase de conception.

Les développements doivent prendre en compte les exigences applicables parmi :

* NIS2
* RGPD
* ISO 27001:2022
* OWASP ASVS v5
* RGAA 4.1.2
* Référentiel Général d'Interopérabilité (RGI)
* Référentiel Général de Sécurité (RGS)
* eIDAS lorsque applicable
* Exigences contractuelles client

Les exigences de conformité doivent être identifiées, documentées et tracées dans les spécifications fonctionnelles et techniques.

Les contrôles de conformité doivent être automatisés autant que possible dans les pipelines CI/CD.

---

# Principe 2 : Architecture Applicative

Les applications doivent respecter les principes suivants :

* Architecture Hexagonale
* Clean Architecture
* Separation of Concerns
* Domain Driven Design lorsque pertinent
* API First
* Event Driven Architecture lorsque pertinent

Les dépendances doivent toujours pointer vers le domaine métier.

Les dépendances circulaires sont interdites.

Les composants doivent être découplés afin de faciliter l'évolution, les tests et les migrations futures.

Toute intégration avec un système tiers doit être protégée par une couche d'anti-corruption (Anti-Corruption Layer) lorsque nécessaire.

Côté front-end, chaque fonctionnalité doit résider dans son propre composant ou répertoire autonome afin de garantir qu'ajouts, modifications et suppressions restent locaux et n'engendrent pas d'effets de bord sur le reste de la base de code.

---

# Principe 3 : Référentiel Technique

À la date de rédaction :

## Front-End

* Angular

## Back-End

* API REST .NET

## Base de données

* PostgreSQL

## Authentification

* OAuth 2.1
* OpenID Connect
* Keycloak
* Microsoft Entra ID

## Messaging

* RabbitMQ lorsque nécessaire

## Observabilité

* OpenTelemetry
* Serilog ECS
* Prometheus
* Grafana
* Loki
* Tempo

## Documentation

* OpenAPI 3.1

Les nouvelles applications doivent être développées avec la dernière version supportée des technologies retenues.

---

# Principe 4 : Sécurité by Design

La sécurité est une exigence fondamentale.

Toute application doit :

* Authentifier les utilisateurs
* Autoriser les actions selon les rôles attribués
* Appliquer le principe du moindre privilège
* Journaliser les opérations sensibles
* Chiffrer les données sensibles
* Protéger les flux réseau
* Sécuriser les secrets

Les mécanismes suivants sont obligatoires :

* OAuth 2.1
* OpenID Connect
* PKCE
* RBAC
* Rotation des secrets
* Gestion centralisée des secrets
* Protection contre les attaques OWASP Top 10

Les secrets ne doivent jamais être stockés :

* dans le code source
* dans les fichiers de configuration
* dans les pipelines CI/CD

Les secrets doivent être externalisés dans un coffre-fort approuvé.

---

# Principe 5 : Protection des Données

Les données doivent être protégées tout au long de leur cycle de vie.

Les applications doivent permettre :

* La minimisation des données
* La traçabilité des traitements
* La gestion des consentements lorsque nécessaire
* La suppression des données conformément au RGPD
* L'export des données personnelles sur demande

Les données sensibles doivent être chiffrées au repos et en transit.

---

# Principe 6 : Accessibilité Numérique et Cohérence UX

Les interfaces utilisateurs doivent être conçues conformément au RGAA 4.1.2.

Les exigences d'accessibilité doivent être intégrées dès la conception.

Les contrôles suivants doivent être pris en compte :

* Navigation clavier complète
* Contrastes conformes
* Compatibilité lecteurs d'écran
* Alternatives textuelles
* Structure sémantique HTML
* Gestion du focus
* Messages d'erreur accessibles

Les composants non conformes doivent être évités.

Les critères RGAA applicables doivent être testés avant toute mise en production.

Les interfaces doivent être responsive et fonctionnelles sur les terminaux cibles (mobile, tablette, bureau).

Toutes les chaînes visibles par l'utilisateur doivent transiter par le mécanisme d'internationalisation (i18n) retenu dans le référentiel technique. Aucun texte d'interface ne doit être codé en dur dans les composants.

Les patterns visuels (espacement, typographie, couleurs) doivent suivre le design system ou le thème partagé défini dans la configuration du projet afin d'assurer une cohérence visuelle globale.

---

# Principe 7 : Qualité Logicielle

## Principes de Conception du Code

Tout code produit doit respecter les principes SOLID :

* **Responsabilité Unique** : chaque composant, service et fonction accomplit exactement une chose.
* **Ouvert/Fermé** : le comportement est étendu par composition et injection de dépendances ; le code stable n'est pas modifié.
* **Substitution de Liskov** : les sous-types doivent pouvoir remplacer leurs types parents sans altérer le comportement.
* **Ségrégation des Interfaces** : les interfaces sont ciblées ; aucun consommateur ne dépend de méthodes qu'il n'utilise pas.
* **Inversion des Dépendances** : les modules de haut niveau dépendent d'abstractions, non d'implémentations concrètes.

Le code doit également respecter KISS et DRY :

* Privilégier la solution la plus simple satisfaisant l'exigence — la complexité doit être explicitement justifiée.
* Extraire la logique partagée uniquement lorsqu'une duplication avérée apparaît au moins deux fois avec une intention identique.
* Éviter l'abstraction prématurée.

## Empreinte Minimale des Dépendances

Chaque ajout de dépendance doit être justifié : la pile existante doit être incapable de résoudre le problème simplement. Avant toute introduction, vérifier le statut de maintenance, la compatibilité de licence et l'impact sur la taille du bundle. La décision doit être documentée (ADR ou description de PR).

Le code mort doit être supprimé dès qu'il devient inutilisé. Les blocs commentés et les feature flags temporaires non livrés sont interdits.

## Tests

Les développements doivent être testés à plusieurs niveaux.

## Tests Unitaires

* xUnit

## Tests d'Intégration

* Obligatoires

## Tests Fonctionnels

* Playwright

## Tests de Non Régression

* Automatisés lorsque possible

Objectifs minimaux :

* Couverture de code ≥ 80 %
* Couverture des parcours critiques = 100 %
* Aucun test critique en échec

Une fonctionnalité ne peut être livrée sans couverture de tests adaptée à son niveau de criticité.

## Critères de Revue de Code

Toute revue de code doit vérifier, en complément de la conformité aux principes de cette constitution :

* Aucun type TypeScript `any` sans désactivation de règle linter accompagnée d'une justification explicite.
* Aucune chaîne visible par l'utilisateur codée en dur contournant le mécanisme d'i18n.
* Aucune instruction de débogage (`console.log`, `debugger`, etc.) dans les chemins de code de production.
* Aucune importation, variable ou symbole exporté déclaré mais inutilisé.

---

# Principe 8 : Observabilité Native

Toute application doit être observable dès sa conception.

Les composants doivent exposer :

* Health Checks
* Readiness Checks
* Liveness Checks
* Logs structurés ECS
* Traces distribuées OpenTelemetry
* Métriques Prometheus

Les journaux doivent permettre :

* L'analyse des incidents
* Les investigations de sécurité
* Les audits réglementaires

Aucun composant ne doit être livré sans mécanisme d'observabilité.

---

# Principe 9 : Cloud Native et Kubernetes

Les applications doivent être conçues pour fonctionner dans des environnements cloud modernes.

Les principes suivants sont obligatoires :

* Stateless lorsque possible
* Configuration externalisée
* Secrets externalisés
* Images minimales
* Conteneurs rootless
* Scalabilité horizontale

Les applications doivent être compatibles avec :

* Kubernetes
* GitOps
* ArgoCD

Les déploiements doivent être reproductibles et automatisables.

---

# Principe 10 : .NET Aspire

Les applications distribuées doivent être compatibles avec la version de référence d'Aspire.

Les ressources applicatives doivent être déclarées dans l'AppHost Aspire.

Lorsque pertinent, Aspire doit être utilisé pour :

* APIs
* Bases de données
* Brokers
* Services externes
* Observabilité

L'observabilité native Aspire doit être activée par défaut.

---

# Principe 11 : DevSecOps

Les pipelines CI/CD doivent intégrer des contrôles automatisés de qualité et de sécurité.

Les contrôles minimums sont :

## Qualité de Code

* SonarQube

## Détection de Secrets

* Gitleaks

## Analyse des Dépendances

* Dependency Track

## Analyse des Conteneurs

* Trivy

## Analyse Dynamique

* OWASP ZAP
* SecureCodeBox lorsque disponible

## Gestion Centralisée des Vulnérabilités

* DefectDojo

Toute vulnérabilité critique ou faille de sécurité bloquante doit empêcher la promotion vers l'environnement suivant.

---

# Principe 12 : Documentation et Traçabilité

Les projets doivent produire une documentation maintenable.

Les livrables minimums sont :

* OpenAPI 3.1
* ADR (Architecture Decision Records)
* Documentation d'architecture
* Documentation d'exploitation
* Documentation d'installation
* Documentation utilisateur lorsque nécessaire

Toute exigence doit être traçable jusqu'à son implémentation.

---

# Principe 13 : Intelligence Artificielle Responsable

L'utilisation d'agents IA est autorisée pour assister les activités de développement.

Toutefois :

* Les spécifications doivent être validées
* Les plans techniques doivent être validés
* Les contrôles qualité doivent être exécutés
* Les contrôles de sécurité doivent être exécutés
* Une validation humaine reste obligatoire

Aucun code généré par IA ne peut être mis en production sans revue humaine.

Les agents IA doivent respecter les exigences de sécurité et de confidentialité définies.

---

# Principe 14 : Workflow de Développement

Toute contribution doit suivre un workflow standardisé garantissant la traçabilité et la non-régression.

## Gestion des Branches

* Les branches de fonctionnalité sont créées depuis la branche d'intégration (`develop` ou équivalent défini par projet).
* La convention de nommage est : `<id-tâche>-description-courte`.

## Qualité Avant Commit

* Le linter doit être exécuté sans erreur avant tout commit.
* Le formatter doit être appliqué avant tout commit.
* Les tests unitaires doivent passer sans régression de couverture.

## Messages de Commit

Les messages de commit doivent suivre la convention **Conventional Commits** :

* `feat:` — nouvelle fonctionnalité
* `fix:` — correction de bug
* `refactor:` — refactoring sans changement de comportement
* `docs:` — documentation uniquement
* `test:` — ajout ou modification de tests
* `chore:` — tâche technique (dépendances, configuration, etc.)

## Pull Requests

* La description doit référencer la spécification ou l'identifiant de tâche concerné.
* Au moins une revue par un pair est requise avant la fusion.
* La PR ne peut être fusionnée tant que les contrôles CI/CD ne sont pas passants.

---

# Critères de Validation d'une Fonctionnalité

Une fonctionnalité est considérée comme terminée uniquement lorsque :

* Les spécifications sont validées
* Les exigences de conformité sont respectées
* Les critères de sécurité sont respectés
* Les critères RGAA sont respectés
* Les tests unitaires sont passants
* Les tests d'intégration sont passants
* Les tests Playwright sont passants
* Les contrôles DevSecOps sont passants
* Le linter et le formatter ont été exécutés sans erreur
* La documentation est produite
* Les revues humaines sont réalisées
* Les critères d'acceptation sont validés

---

# Gouvernance de la Constitution

## Processus d'Amendement

Tout amendement à cette constitution doit :

1. Être proposé sous forme de Pull Request modifiant ce fichier.
2. Inclure une justification et, si le changement est cassant, un plan de migration.
3. Être approuvé par au moins un collaborateur désigné.

## Versioning Sémantique

La constitution suit la gestion sémantique de version :

* **MAJEURE** : suppression ou redéfinition fondamentale d'un principe existant.
* **MINEURE** : ajout d'un nouveau principe ou d'une nouvelle section.
* **PATCH** : clarification, correction de formulation ou raffinement non sémantique.

Toutes les Pull Requests et revues de code doivent vérifier la conformité avec la version en vigueur de cette constitution.

````
