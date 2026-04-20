[< Back to main Menu](https://github.com/gsoulie/Mobile-App-Development)    

# AI Concepts

* [Les bases](https://github.com/gsoulie/angular-resources/blob/master/ai/ai-basics.md)
  * LLM, RAG, Agents, Limites, Risques, Patterns
* [Formation Anthropic](https://github.com/gsoulie/angular-resources/blob/master/ai/ai-anthropic.md)
* [Sécurisation environnement](https://github.com/gsoulie/angular-resources/blob/master/ai/ai-security.md)     

# AI Prompting

* [Collection de prompts](#collection-de-prompts)
* [00-global-orchestrator](https://github.com/gsoulie/angular-resources/blob/master/ai/prompts/00-global-orshestrator.md)    
* [01-full-audit](https://github.com/gsoulie/angular-resources/blob/master/ai/prompts/01-full-optimized-analysis.md)
* [02-a11y-audit](https://github.com/gsoulie/angular-resources/blob/master/ai/prompts/02-a11y-audit.md)
* [03-quality-audit](https://github.com/gsoulie/angular-resources/blob/master/ai/prompts/03-quality-audit.md)
* [04-performance-audit](https://github.com/gsoulie/angular-resources/blob/master/ai/prompts/04-performance-audit.md)
* [05-security-audit](https://github.com/gsoulie/angular-resources/blob/master/ai/prompts/05-security-audit.md)    
* [06-CVE-audit](https://github.com/gsoulie/angular-resources/blob/master/ai/prompts/06-cve-audit.md)
* [07-AVV-estimation-macro](https://github.com/gsoulie/angular-resources/blob/master/ai/prompts/07-estimation-avv.md)    
* [CLAUDE.md](https://github.com/gsoulie/angular-resources/blob/master/ai/prompts/claude.md)    

# Prompt exemple rapide 

<details>
  <sumlmary>Prompt rapide</sumlmary>

````

Agis en tant que Leader technique sénior, spécialisé en frontend moderne (15+ années d'expériences en Angular, NextJS, Typescript) 

Tu privilégies :
- la robustesse
- la maintenabilité long terme
- la performance
- la clarté du raisonnement

Tu évites :
- les suppositions non justifiées
- les solutions à la mode sans valeur ajoutée
- les optimisations prématurées

CONTEXTE : 
- Framework : Angular
- Version : 20+
- Contraintes : performance /sécurité / accessibilité

OBJECTIF : 
Implémenter une feature...

CONTRAINTES :
- Utilise context7 pour être certain d'utiiliser les documentations à jour
- Respect des principes fondamentaux de développement SOLID, KISS, DRY
- Prise en compte des règles standards d'accessibilité fournies par le W3C
- Code lisible et explicite
- Typage stric
- Gestion des cas limites
- Pas de logique implicite

FORMAT : 
1. Code
2. Explication des choix techniques
3. Limites connues

Relis ta réponse précédente de manière critique.

Identifie :
- Toute hypothèse implicite
- Tout point incertain
- Toute information potentiellement incorrecte

Indique clairement ce qui doit être vérifié.
````
  
</details>


# 1. Changer de mentalité : du prompt à l’interface

Un prompt avancé n’est pas une question, c’est :

> 👉 une interface entre ton intention d’ingénieur et un moteur probabiliste

Donc :

* tu spécifies
* tu contraints
* tu évalues
* tu itères

Pense “API”, pas “chat”.

# 2. La structure canonique d’un prompt avancé (à maîtriser)

Voici une structure réutilisable partout :

* RÔLE
* CONTEXTE
* OBJECTIF
* CONTRAINTES
* CRITÈRES DE QUALITÉ
* FORMAT DE SORTIE
* PROCESSUS (optionnel)

Exemple simple (baseline)

❌ Mauvais prompt :     

> "Corrige ce code Angular"

✅ Prompt avancé :     

````
Tu es un expert Angular senior (10+ ans).

CONTEXTE :
- Application Angular 17
- OnPush, standalone components
- Contraintes performance fortes
- Code existant en production

OBJECTIF :
Refactoriser le code pour améliorer lisibilité et maintenabilité
sans modifier le comportement fonctionnel.

CONTRAINTES :
- Pas de breaking change
- Pas de nouvelle dépendance
- Respect strict des conventions Angular

CRITÈRES DE QUALITÉ :
- Code plus lisible
- Complexité réduite
- Typage strict
- Pas de logique dupliquée

FORMAT DE SORTIE :
1. Code refactorisé
2. Liste des améliorations
3. Points de vigilance
````

👉 Tu obtiens moins de surprises, plus de constance.


### Donne toujours un rôle explicite

Les modèles réagissent très fortement à la projection de rôle.

**Rôles efficaces pour un sénior**
* Architecte logiciel
* Tech lead frontend
* Reviewer de pull request
* Staff engineer
* Expert performance / sécurité / accessibilité
* Mainteneur long terme d’un produit critique

> 📌 Règle : 1 prompt = 1 rôle clair

# 3. Patterns de prompting avancé pour développeurs
## 3.1 Prompt “Reviewer strict” (essentiel)

Utilise l’IA contre elle-même.
````
Agis comme un reviewer technique senior, très critique.

Analyse le code ci-dessous et identifie :
- Problèmes de conception
- Bugs potentiels
- Problèmes de performance
- Problèmes de sécurité
- Dettes techniques cachées

Sois précis, factuel et justifié.
Ne propose pas de solution dans un premier temps.
````

👉 Excellent pour détecter les hallucinations plus tard.

## 3.2 Prompt “Double passe” (qualité ++)
### Passe 1 – Production
````
Génère une implémentation répondant aux contraintes suivantes...
````
### Passe 2 – Audit
````
Analyse ta propre réponse précédente comme si tu faisais
une revue de code bloquante en production.
Liste tout ce qui pourrait poser problème.
````

👉 Réduction drastique des erreurs.

## 3.3 Prompt “Hypothèses explicites” (clé pour seniors)
````
Avant de répondre :
1. Liste toutes les hypothèses que tu fais
2. Indique celles qui sont incertaines
3. Pose des questions uniquement si elles sont bloquantes
````

👉 Tu reprends le contrôle sur les zones floues.

## 3.4 Prompt “Arbitrage technique”
````
Compare les approches A et B pour ce contexte précis.

Critères :
- Performance
- Maintenabilité
- Scalabilité
- Courbe d’apprentissage
- Risques à long terme

Conclue par une recommandation argumentée,
avec les trade-offs assumés.
````

👉 Parfait pour décisions d’architecture.

# 4. Prompting orienté code : règles d’or
## Règle n°1 : jamais “écris-moi du code” sans garde-fous

Toujours préciser :

* version
* contraintes runtime
* conventions
* limites

## Règle n°2 : découper les prompts

❌ Un gros prompt fourre-tout      
✅ Une séquence :     

1. Analyse
2. Proposition
3. Validation
4. Raffinement

## Règle n°3 : forcer l’IA à expliquer ses choix
````
Justifie chaque décision technique importante en 1 phrase.
````

# 5. Prompting pour cas concrets de dev logiciel
## 5.1 Debug avancé
````
Agis comme un ingénieur support niveau 3.

Analyse ce bug en te basant uniquement sur :
- le code
- le stack trace
- le contexte fourni

Ne fais aucune supposition non justifiée.
Liste les causes probables par ordre de confiance,
avec le raisonnement associé.
````

## 5.2 Génération de tests (très efficace)
````
Génère uniquement des tests unitaires pour ce code.

Contraintes :
- Test des cas limites
- Pas de mocks inutiles
- Lisibilité prioritaire
- Coverage fonctionnelle, pas artificielle

Indique ce qui n’est pas testable et pourquoi.
````

## 5.3 Documentation fiable
````
Documente ce module comme si :
- un nouveau développeur arrivait
- le code devait vivre 5 ans

Inclure :
- responsabilités
- invariants
- anti-patterns à éviter
````

# 6. Anti-patterns fréquents (à éviter absolument)

❌ Prompt trop vague     
❌ Trop de contexte inutile    
❌ Faire confiance au premier résultat      
❌ Ne pas challenger les réponses     
❌ Mélanger analyse et génération sans contrôle     

# 7. Entraînement pratique (important)

1. Prends un code réel
2. Fais générer une solution
3. Détruis-la avec un prompt reviewer
4. Améliore le prompt, pas le code

👉 Tu progresses plus vite que par simple usage.

# 8. Niveau expert : méta-prompting

Créer tes prompts templates personnels :

* Revue de code
* Architecture
* Debug
* Tests
* Refactor

# Collection de prompts

Routine recommandée

1. Prompt socle
2. Prompt métier (refactor / debug / archi)
3. Prompt anti-hallucination
4. Prompt d’amélioration

## 1. Socle de base à inclure systématiquement 

````
Tu es un ingénieur logiciel senior (15+ ans), spécialisé en frontend moderne.

Tu privilégies :
- la robustesse
- la maintenabilité long terme
- la performance
- la clarté du raisonnement

Tu évites :
- les suppositions non justifiées
- les solutions à la mode sans valeur ajoutée
- les optimisations prématurées
````

## 3. Prompt “anti-hallucination” (indispensable)

À utiliser après toute génération importante.
````
Relis ta réponse précédente de manière critique.

Identifie :
- Toute hypothèse implicite
- Tout point incertain
- Toute information potentiellement incorrecte

Indique clairement ce qui doit être vérifié.
````

## 4. Prompt "amélioration continue"

````
Propose 3 améliorations possibles de la solution précédente,
classées par :
1. Valeur apportée
2. Effort de mise en œuvre
3. Risque

Ne propose rien de superflu.
````

## Code 

<details>
  <summary>Code review stricte</summary>

````
Agis comme un reviewer technique senior très exigeant.

CONTEXTE :
- Code en production
- Frontend TypeScript (Angular / React / Next)

Analyse le code ci-dessous et identifie :
1. Bugs potentiels
2. Problèmes de conception
3. Problèmes de performance
4. Problèmes de sécurité
5. Dettes techniques

Contraintes :
- Sois factuel
- Justifie chaque point
- Ne propose PAS de solution

FORMAT :
Liste structurée par catégorie avec niveau de sévérité (Faible / Moyen / Élevé).
````

  
</details>

<details>
  <summary>Génération de code sous contraintes fortes</summary>
  
````
Tu es un développeur senior extrêmement rigoureux.

CONTEXTE :
- Framework : [Angular / React / Next]
- Version : […]
- Contraintes : performance / sécurité / accessibilité

OBJECTIF :
Implémenter la fonctionnalité suivante :
[…]

CONTRAINTES :
- Code lisible et explicite
- Typage strict
- Gestion des cas limites
- Pas de logique implicite

FORMAT :
1. Code
2. Explication des choix techniques
3. Limites connues
````

</details>

## Refactor

<details>
  <summary>Refactorisation maîtrisée (sans régression)</summary>
  
````
Tu es un expert du refactoring sécurisé.

OBJECTIF :
Refactoriser le code ci-dessous pour améliorer lisibilité et maintenabilité
sans modifier le comportement fonctionnel.

CONTRAINTES :
- Aucun breaking change
- Typage strict TypeScript
- Pas de nouvelle dépendance
- Respect des conventions du framework

PROCESSUS :
1. Explique les problèmes actuels
2. Propose un refactoring
3. Justifie chaque changement

FORMAT :
- Code refactorisé
- Liste des améliorations
- Points de vigilance
````

</details>


## Architecture

<details>
  <summary>Décision d’architecture (arbitrage)</summary>
  
````
Agis comme un architecte logiciel expérimenté.

CONTEXTE :
[Décris le contexte applicatif]

Compare les approches suivantes : A / B / C

Critères d’analyse :
- Performance
- Maintenabilité
- Scalabilité
- Complexité
- Risques long terme

FORMAT :
- Tableau comparatif
- Analyse détaillée
- Recommandation finale argumentée
- Trade-offs assumés
````

</details>

## Debug

<details>
  <summary>Debug avancé (niveau production)</summary>
  
````
Agis comme un ingénieur support niveau 3.

Analyse ce problème en te basant uniquement sur :
- le code fourni
- le message d’erreur / stack trace
- le contexte d’exécution

Règles :
- Ne fais aucune hypothèse non justifiée
- Ne propose pas de solution immédiatement

FORMAT :
1. Causes possibles classées par probabilité
2. Raisonnement associé
3. Informations manquantes (si bloquant)
````

</details>

## Test

<details>
  <summary>Génération tests e2e avec Playwright</summary>

````
Agis comme un QA senior.

À partir de cette user story, propose :
- scénarios de test E2E
- cas limites
- erreurs utilisateur fréquentes

Ne génère PAS de code Playwright.

````

**Génération de code Playwright sous contraintes strictes**

````
Génère un test Playwright pour le scénario suivant.

Contraintes :
- Utiliser des data-testid
- Pas de sélecteurs CSS fragiles
- Attentes explicites (no waitForTimeout)
- Test indépendant et idempotent

Framework : Playwright + TypeScript
````
  
</details>

<details>
  <summary>Génération de tests de qualité</summary>
  
````
Agis comme un expert en tests automatisés.

OBJECTIF :
Générer des tests unitaires pertinents pour le code ci-dessous.

CONTRAINTES :
- Tester les cas normaux et limites
- Pas de tests redondants
- Lisibilité prioritaire
- Framework de test existant uniquement

FORMAT :
- Tests
- Justification des cas testés
- Ce qui n’est pas testable et pourquoi
````

</details>

## Documentation

<details>
  <summary>Documentation long terme (maintenable)</summary>

````
Documente ce module comme s’il devait :
- être maintenu pendant 5 ans
- être repris par un développeur junior

Inclure :
- Rôle du module
- Responsabilités
- Invariants
- Anti-patterns
- Exemples d’usage
````

</details>
