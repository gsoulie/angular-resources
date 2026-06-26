````markdown
<!--
Sync Impact Report
===================
Version change: TEMPLATE (unversioned) → 1.0.0
Bump rationale: Initial ratification — template placeholders replaced with concrete,
                project-specific principles. First formally adopted constitution.

Principles defined (7):
  I.   Qualité du Code (SOLID, KISS, DRY)
  II.  Simplicité & Impact Minimal
  III. Standards de Test (NON-NÉGOCIABLE)
  IV.  Cohérence UX & Accessibilité
  V.   Sécurité
  VI.  Performance & Responsive Design
  VII. Architecture Modulaire & Dépendances Minimales

Added sections:
  - Contraintes Techniques (stack Angular 20+)
  - Workflow de Développement & Quality Gates
  - Governance

Removed sections: none (template slots filled)

Templates requiring updates:
  ✅ .specify/templates/plan-template.md   — generic "Constitution Check" gate; compatible, no edit required
  ✅ .specify/templates/spec-template.md   — no constitution-specific mandatory section to add
  ✅ .specify/templates/tasks-template.md  — tests OPTIONAL note consistent with Principle III scope
  ✅ README.md                              — informational only, no principle references to update

Follow-up TODOs: none
-->

# Angular 20+ Constitution

## Core Principles

### I. Qualité du Code (SOLID, KISS, DRY)

Le code MUST respecter les principes SOLID, KISS et DRY.

- **Single Responsibility** : chaque composant, service ou fonction MUST avoir une seule
  raison de changer. Les composants restent fins ; la logique métier vit dans des services.
- **DRY** : toute logique dupliquée plus d'une fois MUST être extraite (service, utilitaire,
  pipe, directive). Seule la duplication accidentelle non encore avérée est tolérée.
- **KISS** : la solution la plus simple qui satisfait l'exigence MUST être préférée. Toute
  abstraction MUST être justifiée par un besoin réel et actuel (pas de spéculation / YAGNI).
- Les noms MUST être explicites ; un commentaire ne MUST jamais compenser un nom obscur.

**Rationale** : un code simple et factorisé réduit le coût de maintenance, limite les
régressions et reste compréhensible par toute l'équipe.

### II. Simplicité & Impact Minimal

Chaque changement MUST être aussi simple que possible et avoir l'impact le plus faible
possible sur le code existant.

- Une modification MUST rester confinée au périmètre strictement nécessaire à l'exigence.
- Les refactorings opportunistes MUST être séparés des changements fonctionnels (commits /
  PR distincts).
- On NE MUST PAS réécrire ou réorganiser du code non concerné par la tâche.

**Rationale** : des changements ciblés sont plus faciles à relire, à tester et à annuler ;
ils minimisent le risque de régression.

### III. Standards de Test (NON-NÉGOCIABLE)

Tout comportement non trivial MUST être couvert par des tests automatisés (Karma + Jasmine).

- La logique des services, pipes, guards et la logique conditionnelle des composants MUST
  être testée unitairement.
- Tout bug corrigé MUST être accompagné d'un test de non-régression.
- Les tests MUST être déterministes ; aucun test instable (flaky) ne MUST être mergé.
- La suite de tests (`ng test`) MUST passer avant tout merge.

**Rationale** : les tests sont le filet de sécurité qui permet de modifier le code en
confiance et de garantir la stabilité dans le temps.

### IV. Cohérence UX & Accessibilité

L'expérience utilisateur MUST être cohérente et accessible sur l'ensemble de l'application.

- Les composants UI MUST réutiliser les patterns et composants Angular Material / CDK
  existants plutôt que d'en réinventer.
- L'espacement, la typographie et les couleurs MUST suivre un système cohérent (tokens
  Tailwind / thème Material).
- L'application MUST viser la conformité WCAG 2.1 niveau AA : contrastes suffisants,
  navigation clavier complète, attributs ARIA pertinents, focus visible, et libellés sur
  tous les contrôles de formulaire.

**Rationale** : une UX cohérente et accessible élargit l'audience, réduit la charge
cognitive et constitue une exigence de qualité non optionnelle.

### V. Sécurité

La sécurité MUST être prise en compte dès la conception.

- Aucun secret (clé, token, mot de passe) ne MUST être committé dans le dépôt.
- Toute entrée utilisateur MUST être validée ; on NE MUST PAS contourner la sanitization
  d'Angular (`bypassSecurityTrust*`) sans justification documentée.
- Les appels réseau MUST utiliser HTTPS ; les données sensibles NE MUST PAS être stockées
  en clair côté client.
- Les dépendances MUST être tenues à jour et exemptes de vulnérabilités critiques connues.

**Rationale** : la sécurité corrigée a posteriori coûte cher et expose les utilisateurs ;
elle doit être un réflexe permanent.

### VI. Performance & Responsive Design

L'application MUST être performante et responsive sur mobile, tablette et desktop.

- Les pages et fonctionnalités MUST être chargées paresseusement (lazy-loaded routes)
  quand c'est pertinent.
- La détection de changement MUST privilégier les signals et/ou `OnPush` ; on évite le
  travail inutile dans les templates.
- Les layouts MUST être responsive (mobile-first) via les utilitaires Tailwind et le
  CDK Layout.
- On MUST se désabonner des observables (ou utiliser `async` / `takeUntilDestroyed`) pour
  éviter les fuites mémoire.

**Rationale** : la performance et la réactivité conditionnent directement la satisfaction
utilisateur et l'usage réel sur tous les appareils.

### VII. Architecture Modulaire & Dépendances Minimales

Le code MUST être modulaire et évolutif, avec un minimum de dépendances externes.

- Les fonctionnalités MUST être organisées en composants standalone et services injectables
  à responsabilité claire et faiblement couplés.
- Toute nouvelle dépendance npm MUST être justifiée : pas d'ajout si Angular, le CDK,
  RxJS ou Tailwind couvrent déjà le besoin. Privilégier le code natif de la plateforme.
- Les frontières de modules MUST permettre d'ajouter ou de retirer une fonctionnalité sans
  effet de bord sur les autres.

**Rationale** : une architecture modulaire et un graphe de dépendances léger réduisent la
taille du bundle, la surface d'attaque et facilitent l'évolution du produit.

## Contraintes Techniques

La stack technique de référence (voir `package.json`) MUST être respectée :

- **Framework** : Angular 20+ (composants standalone, signals, control flow `@if` / `@for`).
- **UI** : Angular Material 20 + CDK ; **styles** : Tailwind CSS 4 (via PostCSS).
- **Langage** : TypeScript 5.8 en mode strict ; pas de `any` implicite ni non justifié.
- **Réactivité** : RxJS 7.8 ; privilégier les signals pour l'état local.
- **Tests** : Karma + Jasmine.
- **Formatage** : Prettier (config du dépôt) ; le code MUST être formaté avant merge.

Toute déviation à cette stack MUST être justifiée et documentée dans le plan de la
fonctionnalité concernée.

## Workflow de Développement & Quality Gates

- Le travail suit le flux Spec Kit : `specify` → `plan` → `tasks` → `implement`.
- Avant tout merge, les gates suivants MUST être verts :
  1. `ng build` réussit sans erreur.
  2. `ng test` passe (Principe III).
  3. Le code est formaté (Prettier) et sans erreur de lint.
  4. Le diff est minimal et ciblé (Principe II).
- Chaque PR MUST faire l'objet d'une revue vérifiant la conformité aux principes ci-dessus.

## Governance

Cette constitution prévaut sur toutes les autres pratiques de développement du projet.

- **Amendements** : tout changement MUST être documenté (motif + impact), validé en revue,
  et accompagné de la mise à jour des templates dépendants (`plan`, `spec`, `tasks`).
- **Versionnage** : versionnage sémantique de la constitution.
  - **MAJOR** : suppression ou redéfinition incompatible d'un principe / d'une règle de
    gouvernance.
  - **MINOR** : ajout d'un principe ou extension matérielle d'une section.
  - **PATCH** : clarification, reformulation, correction sans portée sémantique.
- **Conformité** : toute PR et toute revue MUST vérifier le respect des principes ; toute
  complexité ajoutée MUST être explicitement justifiée. À défaut de justification, la
  solution la plus simple s'impose.
- Pour la guidance opérationnelle au quotidien, se référer à `CLAUDE.md` et au plan de la
  fonctionnalité en cours.

**Version**: 1.0.0 | **Ratified**: 2026-06-19 | **Last Amended**: 2026-06-19

````
